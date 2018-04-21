import React from 'react';
import "./mines.css";
import { connect } from 'react-redux';
import Board from "./Board";
import Status from "./Status";

function NumericInput(defaultValue, handleChanged) {
    console.log("Making num input val "+defaultValue);
    return <input type="text" className="numInput" value={defaultValue} onChange={(e)=> {
        let val = Math.floor(e.target.value);
        if (!isNaN(val) && val !== undefined) {
             handleChanged(val);
        }
        e.preventDefault();
        } }/>
}

class ControlPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            choosingGameOptions: false,
            newGameConfig: {x: props.config.x, y: props.config.y, mines: props.config.mines},
            // x: props.config.x,
            // y: props.config.y,
            // mines: props.config.mines,
            currentPreset: 0,
            presets: [
                {x: 10, y: 6, mines: 8, name: "Beginner"},
                {x: 20, y: 15, mines: 60, name: "Advanced"},
                {x: 15, y: 25, mines: 60, name: "Mobile"},
                {name: "Custom"},
            ],
        }
        this.state.customPresetIndex = this.state.presets.length-1;

        this.handleXChanged = this.handleXChanged.bind(this);
        this.handleYChanged = this.handleYChanged.bind(this);
        this.handleMinesChanged = this.handleMinesChanged.bind(this);
        this.handlePresetChanged = this.handlePresetChanged.bind(this);
    }

    handleXChanged(val) {
        let newGameConfig = Object.assign({}, this.state.newGameConfig, {x: val});
        this.setState({newGameConfig: newGameConfig, currentPreset: this.state.customPresetIndex});
    }

    handleYChanged(val) {
        let newGameConfig = Object.assign({}, this.state.newGameConfig, {y: val});
        this.setState({newGameConfig: newGameConfig, currentPreset: this.state.customPresetIndex});
    }

    handleMinesChanged(val) {
        let newGameConfig = Object.assign({}, this.state.newGameConfig, {mines: val});
        this.setState({newGameConfig: newGameConfig, currentPreset: this.state.customPresetIndex});
    }

    handlePresetChanged(changeEvent) {
        const presetName = changeEvent.target.value;
        const presetIndex = this.state.presets.findIndex(e => e.name === presetName);
        const preset = this.state.presets[presetIndex];
        if (presetIndex === this.state.customPresetIndex) {
            this.setState({currentPreset: this.state.customPresetIndex});
            return; // custom preset, don't change the numbers
        } 
        let newGameConfig = Object.assign({}, preset);
        this.setState({currentPreset: presetIndex, newGameConfig: newGameConfig});
    }

    onNewGameButton() {
        this.setState({choosingGameOptions: true});
    }

    onCreateGameButton() {
        this.setState({choosingGameOptions: false});
        this.props.onNewGame(this.state.newGameConfig);
    }

    onClickFlag() {
        this.props.onToggleFlag();
    }

    render() {
        const mode = this.props.options.placingFlag ? "Flags" : "Inspecting";

        const makeRadioOption = ((preset, index) => {
            const strKey = "k"+index;
            return <label key={strKey}><input id="option" type="radio" name="field"
                value={preset.name} 
                checked={this.state.currentPreset===index} onChange={this.handlePresetChanged} 
                />{preset.name}<br/></label>
            });
        let radioOptions = this.state.presets.map(makeRadioOption);

        const newGame = this.state.choosingGameOptions ?
            <div id="newGameOpt"> 
                <form>
                New game<br/>
                <table><thead></thead><tbody><tr className="gamePresets"><td colSpan='2'>{radioOptions}
                    </td></tr> 
                    <tr><td>Rows:</td><td>{NumericInput(this.state.newGameConfig.y, this.handleYChanged)}</td></tr>
                    <tr><td>Columns:</td><td>{NumericInput(this.state.newGameConfig.x, this.handleXChanged)}</td></tr>
                    <tr><td>Mines:</td><td>{NumericInput(this.state.newGameConfig.mines, this.handleMinesChanged)}</td></tr>
                </tbody></table>
                <button onClick={()=>this.onCreateGameButton()}>Create Game</button>
                </form>
            </div> 
            : <button onClick={()=>this.onNewGameButton()}>New Game</button>;

        return <div id="controlPanel">
            <button onClick={()=>this.onClickFlag()} autoFocus
                >Change Mode [F]</button> {mode} <br/>
            {this.props.config.x}x{this.props.config.y}, {this.props.config.mines} mines<br/><br/><br/>
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
            <Status />
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
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state[name]});
    return retVal;
}
export default connect(mapStateToProps)(Game);
