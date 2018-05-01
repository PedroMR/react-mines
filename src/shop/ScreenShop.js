import React from 'react';
import * as types from '../types';
import * as tools from '../Tools';
import { connect } from 'react-redux';
import dotProp from 'dot-prop-immutable';
import {buyItem} from './ShopActions';
import './shop.css';
import check from '../img/check.png';
import itemConfig from '../conf/Items';

function ShopItem(props) {
    const item = props.item;
    const checkMark = <img className="icon" width='45' src={check}/>
    const buyText = "Buy for "+item.price;
    const buyContents = props.alreadyOwned ? checkMark : buyText;
    const canBuy = props.canAfford && !props.alreadyOwned;

    return <div className="shopItem">
        <div className='name'>{item.name}</div><br/>
        <div className='description'>{item.description}</div>
        <button disabled={!canBuy} onClick={() => props.onBuy(item)} className='price'>{buyContents}</button>
        </div>;
}

class ScreenShop extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { items: this.findAvailableItems() };
        this.onBuy = this.onBuy.bind(this);
    }

    findAvailableItems() {
        return itemConfig;
    }

    onBuy(item) {
        this.props.dispatch(buyItem(item));
    }

    render() {
        const itemList = this.state.items.map(item => <ShopItem key={item.id}
            item={item}
            onBuy={this.onBuy}
            canAfford={item.price <= this.props.wallet.credits}
            alreadyOwned={tools.ownsItemId(this.props.items, item.id)}
        />);

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
