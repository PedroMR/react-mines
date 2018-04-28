import './meta.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import {changeScreen}  from './MetaActions';

class ScreenMainMenu extends React.PureComponent {

    onPlayMines() {
        this.props.dispatch(changeScreen(types.SCREEN_CREATE_MINES));
        // this.props.dispatch(startNewGame());
    }

    render() {
        return <div className='mainMenu'><button className='playMines' onClick={() => this.onPlayMines()}>Play a game!</button></div>;
    }
}

export default connect()(ScreenMainMenu);
