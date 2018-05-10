import './meta.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import {changeScreen}  from './MetaActions';
import Features from './Features';
import Items from './Items';

class ScreenMainMenu extends React.PureComponent {

    onPlayMines() {
        this.props.dispatch(changeScreen(types.SCREEN_CREATE_MINES));
    }

    onShop() {
        this.props.dispatch(changeScreen(types.SCREEN_SHOP));
    }

    countPurchaseableItems()
    {
        return Items.countPurchaseableItems(this.props.meta);
    }


    render() {
        const numItemsAvailable = this.countPurchaseableItems();
        const showShop = Features.hasFeature(this.props.meta, types.FEATURE_SHOW_SHOP);
        let rooster = null;

        if(numItemsAvailable > 0 && showShop) {
            rooster = <div className="shop rooster">{numItemsAvailable}</div>;
        }

        return <div className='mainMenu'>
            <button className='playMines' onClick={() => this.onPlayMines()}>Hunt for mines</button><br/>
            {showShop ? <div className="shop roosterContainer">{rooster}<button className='shop' onClick={() => this.onShop()}>Shop</button></div> : null}
            </div>;
    }
}

function mapStateToProps (state) {
    return {
        meta: state.meta
    }
}

export default connect(mapStateToProps)(ScreenMainMenu);
