import './meta.css';
import React from 'react';
import { connect } from 'react-redux';
import * as tools from '../Tools';
import * as types from '../types';
import {changeScreen}  from './MetaActions';
import {startNewGame}  from '../mines/MinesActions';

class ScreenMainMenu extends React.PureComponent {

    onPlayMines() {
        this.props.dispatch(changeScreen(types.SCREEN_MINES));
        this.props.dispatch(startNewGame());
    }

    render() {
        return <div className='mainMenu'><button className='playMines' onClick={() => this.onPlayMines()}>Play a game!</button></div>;
    }
}

export default connect()(ScreenMainMenu);
