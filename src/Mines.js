import React from 'react';
import "./mines.css";
import { connect } from 'react-redux';
import Board from "./Board";
import Status from "./Status";
import ControlPanel from "./ControlPanel";
import { resetProfile, startNewGame, setUiMode, debugToggleFeature } from './actions';
import * as types from './types';

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
    
    handleResetProfile() {
        this.props.dispatch(resetProfile());
        this.forceUpdate();
    }

    render() {
        return <div onKeyPress={this.onKeyPress} onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown}
            ><h1>REACT Minesweeper</h1>
            <Version/>
            <Status />
            <Board />
             <ControlPanel
             options={this.props.options}
             config={this.props.config}
             onNewGame={(c) => this.createNewGame(c)}
             onToggleFlag={() => this.onToggleFlag()}
             features={this.props.features}
              />
              <DebugMenu 
                toggleFeature={(feature, turnOn) => { this.props.dispatch(debugToggleFeature(feature, turnOn)); }}
                features={this.props.features}
                handleResetProfile={() => this.handleResetProfile()}
                />
            </div>;
    }
}

function Version(props) {
    return <div className="version">v0.0.1</div>;
}

class DebugMenu extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {shown: true};
    }
    render() {
        const shown = this.state.shown;

        const featureList = [ types.FEATURE_EXPAND, types.FEATURE_ZERO_OUT, types.FEATURE_CUSTOM_MODE, types.FEATURE_PRESET_SELECTION ];
        const featureButtons = featureList.map( (ft) => {
            return <label key={ft}>
                <input type="checkbox" checked={this.props.features[ft]?true:false} name={ft} onChange={(e) => { this.props.toggleFeature(ft, !this.props.features[ft]); }}/>{ft}<br/></label>;
        });
        const resetButton = <button name="Reset" key="reset" onClick={this.props.handleResetProfile}>Reset Profile</button>;
        const allButtons = featureButtons.concat(resetButton);
        return <div className="debugMenu">
            <a onClick={() => { this.setState(...this.state, {shown: !shown})}}><b>&nbsp;*&nbsp;Debug Menu</b></a>
            <br/>{shown ? allButtons : null}</div>
    }
}

function mapStateToProps(state) {
    console.log(state);
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.game[name]});
    retVal.features = state.meta.features;
    return retVal;
}

export default connect(mapStateToProps)(Game);