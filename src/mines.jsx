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
//20x15,40
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
        this.props.onToggleFlag();
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
        this.onKeyDown = this.onKeyDown.bind(this);
        window.onKeyDown = this.onKeyDown;
        window.onKeyPress = this.onKeyPress;
    }

    onToggleFlag() {
        this.props.dispatch({type: "TOGGLEFLAG"});
    }

    isHoldForFlagKey(e) {
        return e.key && (e.key === "Shift" || e.key === "Control") ;
    }

    onKeyPress(e) {
        console.log("PRESS", e.key, e.altKey);
        if (e.key === "f") {
            this.onToggleFlag();
        }
    }

    onKeyUp(e) {
        console.log("UP", e.key, e.altKey);
        if (this.isHoldForFlagKey(e))
             this.onToggleFlag();
    }

    onKeyDown(e) {
        console.log("DOWN", e.key, e.altKey);
        if (this.isHoldForFlagKey(e))
             this.onToggleFlag();
    }

    createNewGame(config) {
        this.props.dispatch({type:"NEWGAME", config: config});
    }

    render() {
        return <div onKeyPress={this.onKeyPress} onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown}
            ><h1>REACT Minesweeper</h1>
            <Board     
             onClick={(x,y) => this.handleClick(x,y)}
             />
             <ControlPanel
             options={this.props.options}
             config={this.props.config}
             onNewGame={(c) => this.createNewGame(c)}
             onToggleFlag={() => this.onToggleFlag()}
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
