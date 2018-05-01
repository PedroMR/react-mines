import React from 'react';
import * as types from '../types';
import { connect } from 'react-redux';
import dotProp from 'dot-prop-immutable';
import './shop.css';

class ShopItem extends React.PureComponent {
    render() {
        const item = this.props.item;
        return <div className="shopItem">
            <table><tbody><tr>
                <td>
            <span className='name'>{item.name}</span><br/>
            <span className='description'>{item.description}</span>
            </td><td>
            <button className='price'>Buy for {item.price}</button>
            </td></tr></tbody></table>
            </div>;
    }
}

class ScreenShop extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { items: this.findAvailableItems() };
    }

    findAvailableItems() {
        return [
            {
                id: 'auto-zero',
                name: "Auto Zeroes",
                price: 20,
                description: "Automatically reveal all neighbors to a zero tile.",
            },{
                id: 'expand-safe',
                name: "Safe Expanding",
                price: 70,
                description: "Click a number to automatically reveal all its neighbors if it's considered safe.",
            },
        ]
    }

    render() {
        const itemList = this.state.items.map(item => <ShopItem key={item.id} item={item} canBuy={item.price < this.props.wallet.credits}/>);

        return <div className="shop"><h3>Shop</h3>{itemList}</div>;
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
