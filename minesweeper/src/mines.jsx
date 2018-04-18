import React from 'react';
import "./mines.css";
import imgMinefield from "./img/minefield.svg";
import { connect } from 'react-redux';
import Board from "./Board";

function NumericInput(defaultValue, handleChanged) {
    return <input type="text" className="numInput" defaultValue={defaultValue} onChange={(e)=>handleChanged(e.target.value)}/>
}

class ControlPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            choosingGameOptions: false,
            x: props.config.x,
            y: props.config.y,
            mines: props.config.mines,
        }

        this.handleXChanged = this.handleXChanged.bind(this);
        this.handleYChanged = this.handleYChanged.bind(this);
        this.handleMinesChanged = this.handleMinesChanged.bind(this);
    }

    handleXChanged(val) {
        this.setState({x: val});
    }

    handleYChanged(val) {
        this.setState({y: val});
    }

    handleMinesChanged(val) {
        this.setState({mines: val});
    }

    onNewGameButton() {
        this.setState({choosingGameOptions: true});
    }

    onCreateGameButton() {
        this.setState({choosingGameOptions: false});
        this.props.onNewGame(this.state);
    }

    onClickFlag() {
        this.props.options.placingFlag = !this.props.options.placingFlag;
        this.props.onChange(this.props.options);
    }

    render() {
        const mode = this.props.options.placingFlag ? "Flags" : "Inspecting";
        const config = this.props.config;

        const newGame = this.state.choosingGameOptions ?
            <div id="newGameOpt"> 
                New game<br/>
                <table><thead></thead><tbody>
                    <tr><td>Rows:</td><td>{NumericInput(config.y, this.handleYChanged)}</td></tr>
                    <tr><td>Columns:</td><td>{NumericInput(config.x, this.handleXChanged)}</td></tr>
                    <tr><td>Mines:</td><td>{NumericInput(config.mines, this.handleMinesChanged)}</td></tr>
                </tbody></table>
                <button onClick={()=>this.onCreateGameButton()}>Create Game</button>
            </div> 
            : <button onClick={()=>this.onNewGameButton()}>New Game</button>;

        return <div id="controlPanel">
            <button onClick={()=>this.onClickFlag()} autoFocus
                >Change Mode [F]</button> {mode} <br/>
            {config.x}x{config.y}, {config.mines} mines<br/><br/><br/>
            {newGame}
        </div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        window.onKeyPress = this.onKeyPress;
    }

    handleClick(x, y) {
        console.log("old click handler returning");
        return;

        const pos = x + y * this.state.config.x;
        let seen = this.state.seen.slice();

        if (!seen[pos]) {
            if (this.state.options.placingFlag) {
                let flags = this.state.flags.slice();
                flags[pos] = !flags[pos];
                this.setState({flags: flags});
            } else {
                if (this.state.flags[pos]) // clicked a flag! no-no
                    return;
                
                seen[pos] = true;
                if (this.state.around[pos] === 0)
                    this.expandAround(x, y, seen);
                this.setState({seen: seen});
            }
        } else {
            //expand
            var flagsAround = this.countFlagsAndVisibleMinesAround(x, y);
            if (flagsAround === this.state.around[pos]) {
                this.expandAround(x,y);
            }
        }
    }

    countFlagsAndVisibleMinesAround(x, y) {
        let n = 0;
        let cols = this.state.config.x;
        let rows = this.state.config.y;

        for (let dy=-1; dy <= 1; dy++) {
            if (y + dy < 0 || y + dy >= rows) continue;
            for (let dx=-1; dx <= 1; dx++) {
                if (x + dx < 0 || x + dx >= cols) continue;                        
                if (dx == dy && dx == 0) continue;

                let neighborPos =  x + dx + (y+dy)*cols;
                if (this.state.flags[neighborPos])
                    n++; // count flag
                else if (this.state.mines[neighborPos] && this.state.seen[neighborPos])
                    n++; // count visible mine
            }
        }

        return n;
    }

    expandAround(x, y, seen) {
        let cols = this.state.config.x;
        let rows = this.state.config.y;
        seen = seen || this.state.seen.slice();        

        for (let dy=-1; dy <= 1; dy++) {
            if (y + dy < 0 || y + dy >= rows) continue;
            for (let dx=-1; dx <= 1; dx++) {
                if (x + dx < 0 || x + dx >= cols) continue;                        
                if (dx == dy && dx == 0) continue;

                let neighborPos =  x + dx + (y+dy)*cols;
                if (!this.state.flags[neighborPos] && !seen[neighborPos]) {
                    seen[neighborPos] = true;
                    if (this.state.around[neighborPos] == 0) {
                        this.expandAround(x+dx,y+dy, seen);
                    }
                }
            }
        }
        this.setState({seen: seen});
    }

    handleOptionsChanged(newOptions) {
        this.setState({options: newOptions});
    }

    onKeyPress(e) {
        console.log("PRESS", e.key, e.altKey);
        if (e.key === "f") {
            this.props.dispatch({type: "TOGGLEFLAG"});
            // let newOptions = Object.assign(this.state.options, {placingFlag: !this.state.options.placingFlag});
            // console.log(newOptions);
            // this.handleOptionsChanged(newOptions);
        }
    }
    onKeyUp(e) {
        console.log("UP", e.key, e.altKey);
    }

    createNewGame(config) {
        var state = this.createGameState(config);
        this.setState(state);
    }

    render() {
        return <div onKeyPress={this.onKeyPress} onKeyUp={this.onKeyUp}
            ><h1>REACT Minesweeper</h1>
            <Board     
             onClick={(x,y) => this.handleClick(x,y)}
             />
             <ControlPanel
             options={this.props.options}
             config={this.props.config}
             onChange={(newOptions) => this.handleOptionsChanged(newOptions)}
             onNewGame={(c) => this.createNewGame(c)}
              />
            </div>;
    }
}

function mapStateToProps(state) {
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state[name]});
    return retVal;
}
export default connect(mapStateToProps)(Game);

// export default Game;