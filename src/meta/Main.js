import React from 'react';
import "../mines.css";
import "./meta.css";
import { connect } from 'react-redux';
import Mines from "../mines/Mines";
import ScreenMainMenu from "./ScreenMainMenu";
import DebugMenu from "./DebugMenu";
import * as types from '../types';
import * as tools from '../Tools';
import { startNewGame } from '../mines/MinesActions';
import packageJson from '../package.alias.json';

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    createNewGame(config) {
        this.props.dispatch(startNewGame(config));
    }

    renderCurrentScreen() {
        switch(this.props.meta.screen) {
            case types.SCREEN_MAIN:
                return <ScreenMainMenu/>;
            case types.SCREEN_MINES:
                return <Mines/>;
            default:
                return <p>Uh-oh</p>;
        }
    }

    render() {
        return <div
            ><h1>Mine Game</h1>
            <Version/>
            <MetaInfo meta={this.props.meta}/>
            {this.renderCurrentScreen()} 
            <DebugMenu />
            </div>;
    }
}

function Version(props) {
    console.log("p", packageJson);
    return <div className="version">{packageJson.version}</div>;
}

function MetaInfo(props) {
    const credits = tools.getCredits(props.meta);
    const creditString = (credits <= 0) ? '\u00A0' : credits+" Credits";

    return <div className='metaInfo'><span className='creditDisplay'>{creditString}</span></div>;
}

function mapStateToProps(state) {
    console.log(state);
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.game[name]});
    retVal.meta = state.meta;
    return retVal;
}

export default connect(mapStateToProps)(Main);