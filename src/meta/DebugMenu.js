import React from 'react';
import { resetProfile, debugAddCredits, debugToggleFeature } from './MetaActions';
import * as types from '../types';
import { connect } from 'react-redux';

class DebugMenu extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {shown: false};
        this.handleResetProfile = this.handleResetProfile.bind(this);
    }
    addCredits(amount) {
        this.props.dispatch(debugAddCredits(amount));
    }
    handleResetProfile() {
        this.props.dispatch(resetProfile());
    }
    toggleFeature(feature, turnOn) {
        this.props.dispatch(debugToggleFeature(feature, turnOn));
    }
    render() {
        const shown = this.state.shown;

        const featureList = [ 
            types.FEATURE_EXPAND, 
            types.FEATURE_ZERO_OUT, 
            types.FEATURE_CUSTOM_MODE,
            types.FEATURE_PRESET_SELECTION,
            types.FEATURE_COLOR_NUMBERS,
            types.FEATURE_DONT_COLOR_DONE,
            types.FEATURE_ERROR_DETECTION,
            types.FEATURE_CLICK_SURROUNDED,
            // types.FEATURE_AUTOCLICK_SAFE,
            // types.FEATURE_AUTOCLICK_SURROUNDED,            
            types.FEATURE_SAFE_FIRST_CLICK,            
            types.FEATURE_ZERO_FIRST_CLICK,
            types.FEATURE_RED_MINES,
            types.FEATURE_MINE_KILLER,
        ];
        // "debug-score-tally",
        /*
        const featureButtons = featureList.map( (ft) => {
            return <label key={ft}>
                <input type="checkbox"
                 checked={this.props.features[ft]?true:false}
                 name={ft}
                 onChange={(e) => { this.toggleFeature(ft); }}/
                 >{ft.replace('feature.', '')}<br/></label>;
        });
        */
        const giveAllFeatures = () => featureList.forEach((ft) => this.toggleFeature(ft, true));

        const allFeaturesButton = <button name='All Powers' key='all-powers' onClick={giveAllFeatures}>All Powers</button>;

        const resetButton = <button name="Reset" key="reset" onClick={this.handleResetProfile}>Reset Profile</button>;
        const addCreditsButton = <button key="add100" onClick={() => this.addCredits(100)}>Add 100</button>;
        // const testSound = <button name="Sound" key="sound" onClick={() => { Sound.playSound(Sound.COIN) }}>Test Sound</button>;

        const allButtons = [allFeaturesButton, addCreditsButton, resetButton];
        return <div className="debugMenu">
            <a onClick={() => { this.setState(...this.state, {shown: !shown})}}><b>&nbsp;*&nbsp;Debug Menu</b></a>
            <br/>{shown ? allButtons : null}</div>
    }
}

function mapStateToProps(state) {
    return {
        features: state.meta.features,
    }
}

export default connect(mapStateToProps)(DebugMenu);