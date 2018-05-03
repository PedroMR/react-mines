import React from 'react';
import * as types from '../types';
import levels from '../conf/Levels';
import { connect } from 'react-redux';
import { startNewGame } from '../mines/MinesActions';
import dotProp from 'dot-prop-immutable';
import Features from './Features';

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
            currentPreset: -1,
            presets: [
                {x: 10, y: 6, mines: 8, name: "Novice"},
                {x: 20, y: 15, mines: 60, name: "Advanced"},
                {x: 11, y: 16, mines: 40, name: "Mobile"},
                {x: 8, y: 8, mines: 10, name: "Old-Time Beginner"},
                {x: 16, y: 16, mines: 40, name: "Old-Time Intermediate"},
                {x: 31, y: 16, mines: 99, name: "Old-Time Expert"},
            ],
        }

        if (this.hasFeature(types.FEATURE_CUSTOM_MODE)) {
            this.state.presets.push({name: "Custom"});
            this.state.customPresetIndex = this.state.presets.length-1;
            this.state.currentPreset = this.state.customPresetIndex;
        } else if (this.hasFeature(types.FEATURE_PRESET_SELECTION)) {
            this.state.newGameConfig = {...this.state.presets[this.state.currentPreset]};
        }

        this.state.presets.forEach((preset, index) => { if (this.configMatches(preset)) this.state.currentPreset = index;})

        
        this.handleNumericInputChanged = this.handleNumericInputChanged.bind(this);
        this.handlePresetChanged = this.handlePresetChanged.bind(this);

        if (!this.hasFeature(types.FEATURE_PRESET_SELECTION) && !this.hasFeature(types.FEATURE_CUSTOM_MODE)) {
            // why stay here?
            let levelNumber = Math.min(this.props.meta.maxLevel, levels.length);
            const levelData = levels[levelNumber];
            const config = levelData.config;
            // this.props.dispatch(startNewGame(this.state.presets[this.state.customPresetIndex]));
            this.props.dispatch(startNewGame(config));
        }
    }

    hasFeature(feature) {
        return Features.hasFeature(this.props.meta, feature);
    }

    configMatches(preset) {
        return (this.state.newGameConfig.x === preset.x && this.state.newGameConfig.y === preset.y && this.state.newGameConfig.mines === preset.mines);
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
            const tiles = preset.x * preset.y;
            const ratio = preset.x ? Number(preset.mines / tiles).toFixed(2)+"%" : "";
            const strKey = "k"+index;
            return <label key={strKey}><input id="option" type="radio" name="field"
                value={preset.name} 
                checked={this.state.currentPreset===index} onChange={this.handlePresetChanged} 
                />{preset.name} {ratio}<br/></label>
            });
        let radioOptions = this.state.presets.map(makeRadioOption);

        const presets =  <tbody><tr className="gamePresets"><td colSpan='2'>{radioOptions}</td></tr></tbody>;
        const enableCustomValues = this.hasFeature(types.FEATURE_CUSTOM_MODE);
        const customValueSelector = <tbody>{[
                {name: "Rows", prop: "y"},
                {name: "Columns", prop: "x"},
                {name: "Mines", prop: "mines"},
            ].map(({name, prop}) => <tr key={prop}><td>{name}:</td><td><NumericInput
                propertyName={"newGameConfig."+prop}
                defaultValue={this.state.newGameConfig[prop]}
                onChange={this.handleNumericInputChanged}
                enabled={enableCustomValues}/></td></tr>)
                }</tbody>;

        const newGame = 
            <div id="newGameOpt"> 
                <form>
                <h3>New game</h3>
                <table><thead></thead>
                    { this.hasFeature(types.FEATURE_PRESET_SELECTION) ? presets : null }
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
        config: state.mines.config,
        meta: state.meta,
    }
}

export default connect(mapStateToProps)(ScreenCreateMines);
