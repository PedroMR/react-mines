import React from 'react';
import "./mines.css";
import { connect } from 'react-redux';
import Board from "./Board";
import DebugMenu from "./DebugMenu";
import Status from "./Status";
import ControlPanel from "./ControlPanel";
import { resetProfile, startNewGame, setUiMode, debugToggleFeature } from './actions';
import * as types from './types';
import * as tools from './Tools';

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
        const newMode = this.props.options.uiMode === types.UI_MODE_FLAG ? types.UI_MODE_REVEAL : types.UI_MODE_FLAG;

        this.props.dispatch(setUiMode(newMode));
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
        this.props.dispatch(startNewGame(config));
    }
    
    render() {
        return <div onKeyPress={this.onKeyPress} onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown}
            ><h1>REACT Minesweeper</h1>
            <Version/>
            <MetaInfo meta={this.props.meta}/>
            <Status />
            <Board />
             <ControlPanel
             options={this.props.options}
             config={this.props.config}
             onNewGame={(c) => this.createNewGame(c)}
             onToggleFlag={() => this.onToggleFlag()}
             features={this.props.meta.features}
              />
              <DebugMenu 
                handleResetProfile={() => this.handleResetProfile()}
                />
            </div>;
    }
}

function Version(props) {
    return <div className="version">v0.0.1</div>;
}

function MetaInfo(props) {
    const credits = tools.getCredits(props.meta);
    const creditString = (credits <= 0) ? '\u00A0' : credits+" Credits";

    return <span className='creditDisplay'>{creditString}</span>;
}

function mapStateToProps(state) {
    console.log(state);
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.game[name]});
    retVal.meta = state.meta;
    return retVal;
}

export default connect(mapStateToProps)(Game);