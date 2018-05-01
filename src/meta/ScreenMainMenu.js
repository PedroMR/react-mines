import './meta.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import {changeScreen}  from './MetaActions';

class ScreenMainMenu extends React.PureComponent {

    onPlayMines() {
        this.props.dispatch(changeScreen(types.SCREEN_CREATE_MINES));
    }

    onShop() {
        this.props.dispatch(changeScreen(types.SCREEN_SHOP));
    }

    render() {
        return <div className='mainMenu'>
            <button className='playMines' onClick={() => this.onPlayMines()}>Hunt for mines</button><br/>
            <button className='shop' onClick={() => this.onShop()}>Shop</button>
            </div>;
    }
}

export default connect()(ScreenMainMenu);
