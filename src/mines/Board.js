import React from 'react';
import { connect } from 'react-redux';
import { flagTile, revealTile, startNewGame } from './MinesActions';
import * as types from '../types';
import Features from '../meta/Features';

function Square(props) {
    let className = "square " + (props.placingFlag ? " square-mode-flag" : " square-mode-inspect");
    if (!props.mine) {
        if (props.completelyOkay) className += " square-okay";
        else if (props.completelySurrounded) className += " square-surrounded";
        else if (props.resolved) className += " square-resolved";
    }
    if (props.gameOver) className = "square square-mode-over";
    if (props.mine) className += " square-mine";
    else if (props.flag) className += " square-flag square-unseen" + (props.placingFlag ? "-flagging" : "");
    else if (!props.seen) className += " square-unseen" + (props.placingFlag ? "-flagging" : "");
    return <button className={className} onClick={props.onClick} onContextMenu={props.onClick}>{props.value}</button>;
}

class Board extends React.Component {
    makeSquare(x, y) {
        const pos = x + y*this.props.config.x;
        const seen = this.props.seen[pos];
        const around = this.props.around[pos];
        const mine = seen && this.props.mines[pos];
        const flag = this.props.flags[pos];        
        let value = seen ? (mine ? "*" : around) : "";
        if (value === 0 && this.hasFeature(types.FEATURE_BLANK_ZEROES)) value = "";

        const flagsAndMinesAround = this.countFlagsAndVisibleMinesAround(x, y);
        const resolved = this.countNeighbors(x, y, (pos) => !this.props.seen[pos] && !this.props.flags[pos]) === 0;
        const okay = (!resolved || !this.hasFeature(types.FEATURE_DONT_COLOR_DONE)) && this.hasFeature(types.FEATURE_COLOR_NUMBERS) && around === flagsAndMinesAround;
        const unseenAround = this.countNeighbors(x, y, (pos) => !this.props.seen[pos] && !this.props.flags[pos]);
        const surrounded = (!resolved || !this.hasFeature(types.FEATURE_DONT_COLOR_DONE)) && this.hasFeature(types.FEATURE_COLOR_NUMBERS) && (unseenAround + flagsAndMinesAround) === around;

        let error = null;

        if (seen && this.hasFeature(types.FEATURE_ERROR_DETECTION) && around < flagsAndMinesAround) {
            value += "!";
            error = true;
        } 
        // value = safeAround;
        return <Square key={x+","+y} 
             onClick={(e) => this.handleClick(x, y, pos, seen, around, flag, mine, e)}
            placingFlag={this.isPlacingFlag()}
            mine={mine}
            seen={seen}
            resolved={!error && resolved && this.hasFeature(types.FEATURE_COLOR_NUMBERS) && this.hasFeature(types.FEATURE_DONT_COLOR_DONE)}
            completelyOkay={!error && okay}
            completelySurrounded={error|| surrounded}
            gameOver={this.props.gameOver}
            around={around}
            flag={flag}
            value={value}/>
    }

    hasFeature(featureId) {
        return Features.hasFeature(this.props.meta, featureId);
    }

    hasAutoClickFeatures() {
        return this.hasFeature(types.FEATURE_AUTOCLICK_SURROUNDED) || this.hasFeature(types.FEATURE_AUTOCLICK_SAFE)
    }

    checkAutoClick() {
        console.log("auto-click");
        for(let y=0; y < this.props.config.y; y++) {
            for(let x=0; x < this.props.config.x; x++) {
                if (this.hasFeature(types.FEATURE_AUTOCLICK_SURROUNDED) && this.isSurrounded(x, y)) {
                    this.flagAllTilesAround(x, y);
                    return;
                }
                if (this.hasFeature(types.FEATURE_AUTOCLICK_SAFE) && this.isSafe(x, y)) {
                    this.expandAround(x, y);
                    return;
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state && this.state.waitingForRegen) {
            this.setState({waitingForRegen: false});
            const pos = this.state.waitingForRegen.x + this.state.waitingForRegen.y*this.props.config.x;
            const seen = this.props.seen[pos];
            const around = this.props.around[pos];
            const mine = seen && this.props.mines[pos];
            const flag = this.props.flags[pos];        
            console.log("Regenned game! ", this.state.waitingForRegen, " around ", around, " seen "+seen);
            this.handleClick(this.state.waitingForRegen.x, this.state.waitingForRegen.y, pos, seen, around, flag, mine);
        }
        if (this.hasAutoClickFeatures() && (prevProps.seen !== this.props.seen || prevProps.flags !== this.props.flags)) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.timer = setTimeout(() => {this.checkAutoClick()}, 100); //this.props.options.autoClickTimer 
        }

    }

    isSafe(x,y) {
        const pos = x + y*this.props.config.x;
        const seen = this.props.seen[pos];
        if (!seen) return false;
        const resolved = this.countNeighbors(x, y, (npos) => !this.props.seen[npos] && !this.props.flags[npos]) === 0;
        if (resolved) return false;
        const around = this.props.around[pos];        
        const flagsAndMinesAround = this.countFlagsAndVisibleMinesAround(x, y);
        return around === flagsAndMinesAround;
    }

    isSurrounded(x, y) {
        const pos = x + y*this.props.config.x;
        const seen = this.props.seen[pos];
        if (!seen) return false;
        if (this.props.mines[pos]) return false;
        const resolved = this.countNeighbors(x, y, (npos) => !this.props.seen[npos] && !this.props.flags[npos]) === 0;
        if (resolved) return false;
        const around = this.props.around[pos];        
        const flagsAndMinesAround = this.countFlagsAndVisibleMinesAround(x, y);
        const unseenAround = this.countNeighbors(x, y, (npos) => !this.props.seen[npos] && !this.props.flags[npos]);
        // console.log("unseen "+unseenAround+" flagsAndMines "+flagsAndMinesAround+" ?== "+around+" "+((unseenAround + flagsAndMinesAround) === around));
        return (unseenAround + flagsAndMinesAround) === around
    }

    countNeighbors(x, y, fn) {
        let n = 0;
        let cols = this.props.config.x;
        let rows = this.props.config.y;

        for (let dy=-1; dy <= 1; dy++) {
            if (y + dy < 0 || y + dy >= rows) continue;
            for (let dx=-1; dx <= 1; dx++) {
                if (x + dx < 0 || x + dx >= cols) continue;                        
                if (dx === dy && dx === 0) continue;

                let neighborPos =  x + dx + (y+dy)*cols;
                if (fn(neighborPos, x+dx, y+dy))
                    n++;
            }
        }

        return n;
    }

    isPlacingFlag() {
        return this.props.options.uiMode === types.UI_MODE_FLAG;
    }

    handleClick(x, y, pos, seen, around, flag, mine, e) {
        if (e) e.preventDefault();
        if (seen) {
            if (mine) return;

            if (this.hasFeature(types.FEATURE_CLICK_SURROUNDED) && this.isSurrounded(x, y)) {
                this.flagAllTilesAround(x, y);
            }

            if (this.hasFeature(types.FEATURE_EXPAND) && around === this.countFlagsAndVisibleMinesAround(x, y)) {
                this.expandAround(x, y);                
            }

            if (this.hasFeature(types.FEATURE_ZERO_OUT) && around === 0) {
                this.expandAround(x, y);
            }            
            return;
        }

        if (this.isPlacingFlag() || e.type === 'contextmenu')
            this.props.dispatch(flagTile(x, y));
        else if (!flag) {
            if (this.props.clicksSoFar === 0) {
                if ((this.props.mines[pos] && this.hasFeature(types.FEATURE_SAFE_FIRST_CLICK)) || 
                    (this.props.around[pos] > 0  && this.hasFeature(types.FEATURE_ZERO_FIRST_CLICK))) {
                    this.props.dispatch(startNewGame(this.props.config, x, y, this.hasFeature(types.FEATURE_ZERO_FIRST_CLICK) ? 1 : 0));
                    this.setState({waitingForRegen: {x, y}});
                }
            }

            this.props.dispatch(revealTile(x, y));
            if (this.hasFeature(types.FEATURE_ZERO_OUT) && around === 0) {
                this.expandAround(x, y);
            }
        }
    }

    flagAllTilesAround(x, y) {
        this.countNeighbors(x, y, (npos,nx,ny) => {
            if (!this.props.seen[npos] && !this.props.flags[npos]) {
                this.props.dispatch(flagTile(nx, ny, true));
            }
        });
    }


    countFlagsAndVisibleMinesAround(x, y) {
        return this.countNeighbors(x, y, (pos) => (this.props.flags[pos] || (this.props.mines[pos] && this.props.seen[pos])));
    }

    expandAround(x, y, queued = []) {
        return this.countNeighbors(x, y, (pos, nx, ny) => {
            if (!this.props.flags[pos] && !this.props.seen[pos] && !queued[pos]) {
                queued[pos] = true;
                this.props.dispatch(revealTile(nx, ny));
                if (this.hasFeature(types.FEATURE_ZERO_OUT) && this.props.around[pos] === 0) {
                    this.expandAround(nx,ny, queued);
                }
            }
        });
    }

    render() {
        let rows = []
        for(let i=0; i < this.props.config.y; i++) {
            let row = [] 
            for(let j=0; j < this.props.config.x; j++) {
                row.push(this.makeSquare(j, i));
            }
            rows.push(<div className="board-row" key={i}>{row}</div>);
        }
        return <div className="board">{rows}</div>;
    }
}




function mapStateToProps(state) {
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver', 'clicksSoFar'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.mines[name]});

    retVal.meta = state.meta;
    return retVal;
}
export default connect(mapStateToProps)(Board);
