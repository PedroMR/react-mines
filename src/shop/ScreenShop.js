import React from 'react';
import * as types from '../types';
import { connect } from 'react-redux';
import dotProp from 'dot-prop-immutable';
import './shop.css';
import itemConfig from '../conf/Items';

class ShopItem extends React.PureComponent {
    render() {
        const item = this.props.item;
        return <div className="shopItem">
            <div className='name'>{item.name}</div><br/>
            <div className='description'>{item.description}</div>
            <button className='price'>Buy for {item.price}</button>
            </div>;
    }
}

class ScreenShop extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { items: this.findAvailableItems() };
    }

    findAvailableItems() {
        return itemConfig;
    }

    render() {
        const itemList = this.state.items.map(item => <ShopItem key={item.id} item={item} canBuy={item.price < this.props.wallet.credits}/>);

        return <div className="shop"><h3>Shop</h3><center>{itemList}</center></div>;
    }

}

function mapStateToProps(state) {
    return {
        wallet: state.meta.wallet,
        items: state.meta.items,
        features: state.meta.features,
    }
}

export default connect(mapStateToProps)(ScreenShop);
