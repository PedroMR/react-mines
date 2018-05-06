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
import ScreenShop from '../shop/ScreenShop';
import ReactGA from 'react-ga';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.initializeGA();
    }
    
    initializeGA() {
        const trackingID = /localhost/.test(document.location.hostname) ? 'UA-XXXX' : 'UA-82637064-2';
        console.log(trackingID);
        ReactGA.initialize(trackingID, { debug: true });
    }

    createNewGame(config) {
        this.props.dispatch(startNewGame(config));
    }

    renderCurrentScreen() {
        ReactGA.pageview(this.props.current.screen);
        switch(this.props.current.screen) {
            case types.SCREEN_MAIN:
                return <ScreenMainMenu/>;
            case types.SCREEN_SHOP:
                return <ScreenShop/>;
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
        const currentScreen = this.props.current.screen; 
        return currentScreen !== types.SCREEN_MAIN &&
                !(currentScreen === types.SCREEN_PLAY_MINES && this.props.gameOver); // FIXME should be a property set by the game state...???
    }

    render() {
        const backButton = <button className="backButton" onClick={this.handleBackButton}>Back</button>;
        return <div
            ><h1>Mines</h1>
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
    const creditString = (credits <= 0 || !credits) ? '\u00A0' : credits+" Credits";

    return <div className='metaInfo'><span className='creditDisplay'>{creditString}</span></div>;
}

function mapStateToProps(state) {
    return {
        meta: state.meta,
        current: state.meta.current,
    }
}

export default connect(mapStateToProps)(Main);