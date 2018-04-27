import React from 'react';
import { connect } from 'react-redux';
import * as tools from '../Tools';
import * as types from '../types';
import {changeScreen}  from '../meta/MetaActions';

class ScreenMainMenu extends React.PureComponent {

    onPlayMines() {
        this.props.dispatch(changeScreen(types.SCREEN_MINES));
    }

    render() {
        return <div class='mainMenu'><button onClick={() => this.onPlayMines()} className='playMines'>Play a game!</button></div>;
    }
}

export default connect()(ScreenMainMenu);
