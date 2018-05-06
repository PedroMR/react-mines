import './meta.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import {changeScreen}  from './MetaActions';
import Features from './Features';

class ScreenMainMenu extends React.PureComponent {

    onPlayMines() {
        this.props.dispatch(changeScreen(types.SCREEN_CREATE_MINES));
    }

    onShop() {
        this.props.dispatch(changeScreen(types.SCREEN_SHOP));
    }

    render() {
        const showShop = Features.hasFeature(this.props.meta, types.FEATURE_SHOW_SHOP);
        return <div className='mainMenu'>
            <button className='playMines' onClick={() => this.onPlayMines()}>Hunt for mines</button><br/>
            {showShop ? <button className='shop' onClick={() => this.onShop()}>Shop</button> : null}
            </div>;
    }
}

function mapStateToProps (state) {
    return {
        meta: state.meta
    }
}

export default connect(mapStateToProps)(ScreenMainMenu);
