import './meta.css';
import React from 'react';
import { connect } from 'react-redux';
import * as types from '../types';
import {changeScreen}  from './MetaActions';
import Features from './Features';
import Items from './Items';
import Sound from '../sound';
import { Button, Badge } from 'react-bootstrap';

class ScreenMainMenu extends React.PureComponent {

    onPlayMines() {
        Sound.playSound(Sound.CLICK_BUTTON);
        this.props.dispatch(changeScreen(types.SCREEN_CREATE_MINES));
    }

    onShop() {
        Sound.playSound(Sound.CLICK_BUTTON);
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
        let badge = null;

        if(numItemsAvailable > 0 && showShop) {
            rooster = <div className="shop rooster">{numItemsAvailable}</div>;
            badge = <Badge pullRight={true}>{numItemsAvailable}</Badge>;
        }


        return <div className='mainMenu'>
            <Button className='playMines' bsStyle='primary' bsSize='large' onClick={() => this.onPlayMines()}>Hunt for mines</Button><br/>
            {showShop ? <Button className='shop' onClick={() => this.onShop()}>&nbsp;Shop&nbsp;{badge}</Button> : null}
            </div>;
    }
}

function mapStateToProps (state) {
    return {
        meta: state.meta
    }
}

export default connect(mapStateToProps)(ScreenMainMenu);
