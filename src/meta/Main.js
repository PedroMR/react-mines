import React from 'react';
import "../mines.css";
import "./meta.css";
import { connect } from 'react-redux';
import Mines from "../mines/Mines";
import ScreenMainMenu from "./ScreenMainMenu";
import ScreenCreateMines from "./ScreenCreateMines";
import DebugMenu from "./DebugMenu";
import * as types from '../types';
import * as tools from '../Tools';
import { startNewGame } from '../mines/MinesActions';
import packageJson from '../package.alias.json';
import { changeScreen } from './MetaActions';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    createNewGame(config) {
        this.props.dispatch(startNewGame(config));
    }

    renderCurrentScreen() {
        switch(this.props.meta.screen) {
            case types.SCREEN_MAIN:
                return <ScreenMainMenu/>;
            case types.SCREEN_PLAY_MINES:
                return <Mines/>;
            case types.SCREEN_CREATE_MINES:
                return <ScreenCreateMines config={this.props.config} features={this.props.features}/>;
            default:
                return <p>Uh-oh</p>;
        }
    }
    
    handleBackButton() {
        this.props.dispatch(changeScreen(types.SCREEN_MAIN));
    }

    canGoBack() {
        const currentScreen = this.props.meta.screen; 
        return currentScreen !== types.SCREEN_MAIN &&
                !(currentScreen === types.SCREEN_PLAY_MINES && this.props.gameOver); // FIXME should be a property set by the game state...???
    }

    render() {
        const backButton = <button className="backButton" onClick={this.handleBackButton}>Back</button>;
        return <div
            ><h1>Mine Game</h1>
            <Version/>
            {this.canGoBack() ? backButton : null}
            <MetaInfo meta={this.props.meta}/>
            {this.renderCurrentScreen()} 
            <DebugMenu />
            </div>;
    }
}

function Version(props) {
    return <div className="version">{packageJson.version}</div>;
}

function MetaInfo(props) {
    const credits = tools.getCredits(props.meta);
    const creditString = (credits <= 0) ? '\u00A0' : credits+" Credits";

    return <div className='metaInfo'><span className='creditDisplay'>{creditString}</span></div>;
}

function mapStateToProps(state) {
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.game[name]});
    retVal.meta = state.meta;
    return retVal;
}

export default connect(mapStateToProps)(Main);