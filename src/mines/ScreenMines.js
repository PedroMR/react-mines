import React from 'react';
import { connect } from 'react-redux';
import Board from "./Board";
import MinesPowerList from "./MinesPowerList";
import Status from "./Status";
import ControlPanel from "./ControlPanel";
import { startNewGame, setUiMode, toggleDisableFeature } from './MinesActions';
import * as types from '../types';
import Features from '../meta/Features';
import Items from '../meta/Items';
import { toolCatalogue } from '../conf/PowerDatabase';

class ScreenMines extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        window.onKeyDown = this.onKeyDown;
        window.onKeyPress = this.onKeyPress;
        this.handleToggleFeature = this.handleToggleFeature.bind(this);
        this.handleSetMode = this.handleSetMode.bind(this);
    }

    handleSetMode(newMode) {
        this.props.dispatch(setUiMode(newMode));
    }

    handleToggleFeature(feature) {
        this.props.dispatch(toggleDisableFeature(feature));
    }

    onToggleFlag() {
        const newMode = this.props.options.uiMode === types.UI_MODE_FLAG ? types.UI_MODE_REVEAL : types.UI_MODE_FLAG;

        this.handleSetMode(newMode);
    }

    isHoldForFlagKey(e) {
        return e.key && (e.key === "Shift" || e.key === "Control") ;
    }

    onKeyPress(e) {
        // console.log("PRESS", e.key, e.altKey);
        if (e.key === "f") {
            this.onToggleFlag();
        }

        for (var tool of toolCatalogue) {
            if (tool.hotkey.toLowerCase() === e.key) {
                // FIXME check we unlocked it
                this.handleSetMode(tool.mode);
                break;
            }
        }

    }

    onKeyUp(e) {
        // console.log("UP", e.key, e.altKey);
        if (this.isHoldForFlagKey(e))
             this.onToggleFlag();
    }

    onKeyDown(e) {
        // console.log("DOWN", e.key, e.altKey);
        if (this.isHoldForFlagKey(e))
             this.onToggleFlag();
    }

    createNewGame(config) {
        this.props.dispatch(startNewGame(config));
    }

    renderCurrentScreen() {
        if (true) {
            
        }
        return null;
    }
    
    render() {
        return <div  onKeyPress={this.onKeyPress} onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown}>
                <MinesPowerList 
                    items={this.props.meta.items}
                    ownsFeature={(id) => Features.ownsFeature(this.props.meta, id)}
                    isFeatureDisabled={(id) => Features.isFeatureDisabled(this.props.meta, id)}
                    onToggleFeature={this.handleToggleFeature}
                    onSetMode={this.handleSetMode}
                    currentMode={this.props.options.uiMode}
                    getToolAmount={(toolId) => Items.getToolAmount(this.props.mines, toolId)}
                    />
                <Status />
                <Board />
                <ControlPanel
                    options={this.props.options}
                    config={this.props.config}
                    onNewGame={(c) => this.createNewGame(c)}
                    onToggleFlag={() => this.onToggleFlag()}
                    features={this.props.meta.features}
                    />
            </div>;
    }
}

function mapStateToProps(state) {
    console.log(state);
    const propNames = [ 'config', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.mines[name]});
    retVal.meta = state.meta;
    retVal.mines = state.mines;
    return retVal;
}

export default connect(mapStateToProps)(ScreenMines);