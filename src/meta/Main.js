import React from 'react';
import "../mines.css";
import { connect } from 'react-redux';
import Mines from "../mines/Mines";
import DebugMenu from "./DebugMenu";
import * as types from '../types';
import * as tools from '../Tools';
import { startNewGame } from '../mines/MinesActions';

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    createNewGame(config) {
        this.props.dispatch(startNewGame(config));
    }
    
    render() {
        return <div
            ><h1>REACT Minesweeper</h1>
            <Version/>
            <MetaInfo meta={this.props.meta}/>
            <Mines /> 
            <DebugMenu />
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

export default connect(mapStateToProps)(Main);