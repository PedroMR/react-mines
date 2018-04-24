import React from 'react';
import "./mines.css";
import { connect } from 'react-redux';
import { flagTile, revealTile } from './actions';

function Square(props) {
    let className = "square " + (props.placingFlag ? " square-mode-flag" : " square-mode-inspect");
    if (props.gameOver) className = "square square-mode-over";
    if (props.mine) className += " square-mine";
    else if (props.flag) className += " square-flag square-unseen" + (props.placingFlag ? "-flagging" : "");
    else if (!props.seen) className += " square-unseen" + (props.placingFlag ? "-flagging" : "");
    return <button className={className} onClick={props.onClick}>{props.value}</button>;
}

class Board extends React.Component {
    makeSquare(x, y) {
        const pos = x + y*this.props.config.x;
        const seen = this.props.seen[pos];
        const around = this.props.around[pos];
        const mine = seen && this.props.mines[pos];
        const flag = this.props.flags[pos];        
        let value = seen ? (mine ? "*" : around) : "";
        if (value === 0) value = "";
        return <Square key={x+","+y} 
             onClick={() => this.handleClick(x, y, pos, seen, around, flag, mine)}
            placingFlag={this.props.options.placingFlag}
            mine={mine}
            seen={seen}
            gameOver={this.props.gameOver}
            around={around}
            flag={flag}
            value={value}/>
    }

    handleClick(x, y, pos, seen, around, flag, mine) {        
        if (seen) {
            if (mine) return;

            if (around == this.countFlagsAndVisibleMinesAround(x, y)) {
                this.expandAround(x, y);                
            }
            return;
        }

        if (this.props.options.placingFlag)
            this.props.dispatch(flagTile(x, y));
        else if (!flag)
            this.props.dispatch(revealTile(x, y));
    }

    countFlagsAndVisibleMinesAround(x, y) {
        let n = 0;
        let cols = this.props.config.x;
        let rows = this.props.config.y;

        for (let dy=-1; dy <= 1; dy++) {
            if (y + dy < 0 || y + dy >= rows) continue;
            for (let dx=-1; dx <= 1; dx++) {
                if (x + dx < 0 || x + dx >= cols) continue;                        
                if (dx === dy && dx === 0) continue;

                let neighborPos =  x + dx + (y+dy)*cols;
                if (this.props.flags[neighborPos])
                    n++; // count flag
                else if (this.props.mines[neighborPos] && this.props.seen[neighborPos])
                    n++; // count visible mine
            }
        }

        return n;
    }

    expandAround(x, y, queued = []) {
        let cols = this.props.config.x;
        let rows = this.props.config.y;

        for (let dy=-1; dy <= 1; dy++) {
            if (y + dy < 0 || y + dy >= rows) continue;
            for (let dx=-1; dx <= 1; dx++) {
                if (x + dx < 0 || x + dx >= cols) continue;                        
                if (dx === dy && dx === 0) continue;

                let neighborPos =  x + dx + (y+dy)*cols;
                if (!this.props.flags[neighborPos] && !this.props.seen[neighborPos] && !queued[neighborPos]) {
                    queued[neighborPos] = true;
                    this.props.dispatch(revealTile(x+dx, y+dy));
                    if (this.props.around[neighborPos] === 0) {
                        this.expandAround(x+dx,y+dy, queued);
                    }
                }
            }
        }
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
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state[name]});
    return retVal;
}
export default connect(mapStateToProps)(Board);
