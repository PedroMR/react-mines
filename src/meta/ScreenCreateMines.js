import React from 'react';
import * as types from '../types';
import { connect } from 'react-redux';
import { startNewGame } from '../mines/MinesActions';
import { changeScreen } from './MetaActions';
import { start } from 'pretty-error';
import dotProp from 'dot-prop-immutable';

function NumericInput(props) { 
    const {propertyName, onChange, enabled, defaultValue} = props;
    return <input type="text" name={propertyName} className="numInput" disabled={!enabled} value={defaultValue} onChange={(e)=> {
        let val = Math.floor(e.target.value);
        if (!isNaN(val) && val !== undefined) {
            onChange(e.target, val);
        }
        e.preventDefault();
     } }/>
}


class ScreenCreateMines extends React.Component {
    constructor(props) {
        super(props);
        const config = props.config;

        this.state = {
            newGameConfig: {x: config.x, y: config.y, mines: config.mines},
            currentPreset: 0,
            presets: [
                {x: 10, y: 6, mines: 8, name: "Beginner"},
                {x: 20, y: 15, mines: 60, name: "Advanced"},
                {x: 11, y: 16, mines: 45, name: "Mobile"},
            ],
        }

        if (this.props.features[types.FEATURE_CUSTOM_MODE]) {
            this.state.presets.push({name: "Custom"});
            this.state.customPresetIndex = this.state.presets.length-1;
            this.state.currentPreset = this.state.customPresetIndex;
        } else if (this.props.features[types.FEATURE_PRESET_SELECTION]) {
            this.state.newGameConfig = {...this.state.presets[this.state.currentPreset]};
        }

        this.state.presets.forEach((preset, index) => { if (this.configMatches(preset)) this.state.currentPreset = index;})

        
        this.handleNumericInputChanged = this.handleNumericInputChanged.bind(this);
        this.handlePresetChanged = this.handlePresetChanged.bind(this);

        if (!this.props.features[types.FEATURE_PRESET_SELECTION] && !this.props.features[types.FEATURE_CUSTOM_MODE]) {
            // why stay here?
            this.props.dispatch(startNewGame(this.state.presets[0]));
        }
    }

    configMatches(preset) {
        return (this.x === preset.x && this.y === preset.y && this.mines === preset.mines);
    }

    handleNumericInputChanged2(propertyName, val) {
        let newState = dotProp.set(this.state, propertyName, val);
        newState.currentPreset = newState.customPresetIndex;
        this.setState(newState);
    }

    handleNumericInputChanged(target, val) {
        const name = typeof target === 'string' ? target : target.name;
        let newState = dotProp.set(this.state, name, val);
        newState.currentPreset = newState.customPresetIndex;
        this.setState(newState);
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

    onCreateGameButton() {
        this.props.dispatch(startNewGame(this.state.newGameConfig));
    }

    onClickFlag() {
        this.props.onToggleFlag();
    }  

    render() {
        const makeRadioOption = ((preset, index) => {
            const strKey = "k"+index;
            return <label key={strKey}><input id="option" type="radio" name="field"
                value={preset.name} 
                checked={this.state.currentPreset===index} onChange={this.handlePresetChanged} 
                />{preset.name}<br/></label>
            });
        let radioOptions = this.state.presets.map(makeRadioOption);

        const presets =  <tbody><tr className="gamePresets"><td colSpan='2'>{radioOptions}</td></tr></tbody>;
        const enableCustomValues = this.props.features[types.FEATURE_CUSTOM_MODE];
        const customValueSelector = <tbody>
                    <tr><td>Rows:</td><td><NumericInput propertyName="newGameConfig.y" defaultValue={this.state.newGameConfig.y} onChange={this.handleNumericInputChanged} enabled={enableCustomValues}/></td></tr>
                    <tr><td>Columns:</td><td><NumericInput propertyName="newGameConfig.x" defaultValue={this.state.newGameConfig.x} onChange={this.handleNumericInputChanged} enabled={enableCustomValues}/></td></tr>
                    <tr><td>Mines:</td><td><NumericInput propertyName="newGameConfig.mines" defaultValue={this.state.newGameConfig.mines} onChange={this.handleNumericInputChanged} enabled={enableCustomValues}/></td></tr>
                    </tbody>;

        const newGame = 
            <div id="newGameOpt"> 
                <form>
                <h3>New game</h3>
                <table><thead></thead>
                    { this.props.features[types.FEATURE_PRESET_SELECTION] ? presets : null }
                    { customValueSelector }
                </table>
                <button onClick={()=>this.onCreateGameButton()}>Create Game</button>
                </form>
            </div>;

        return <div id="createMines">
            {newGame}
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        config: state.game.config,
        features: state.meta.features,
    }
}

export default connect(mapStateToProps)(ScreenCreateMines);
