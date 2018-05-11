import React from 'react';
import * as tools from '../Tools';
import { connect } from 'react-redux';
import {buyItem} from './ShopActions';
import './shop.css';
import check from '../img/check.png';
import itemConfig from '../conf/ItemDatabase';
import Items from '../meta/Items';
import ReactGA from 'react-ga';
import * as Require from '../meta/Require';
import Sound from '../sound';

function ShopItem(props) {
    const item = props.item;
    const checkMark = <img className="icon" width='45' alt="check" src={check}/>
    const buyText = "Buy for "+tools.formatPrice(item.price);
    const buyContents = props.alreadyOwned ? checkMark : buyText;
    const canBuy = props.canAfford && !props.alreadyOwned;
    let itemClass = "shopItem"
    if (props.alreadyOwned) itemClass += " owned";

    return <div className={itemClass}>
        <div className='name'>{item.name}</div><br/>
        <div className='description'>{item.description}</div>
        <button disabled={!canBuy} onClick={() => props.onBuy(item)} className='price'>{buyContents}</button>
        </div>;
}

class ScreenShop extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { shopItems: this.findAvailableItems() };
        this.onBuy = this.onBuy.bind(this);
    }

    findAvailableItems() {
        const ownedItems = this.props.items;
        let availableItems = itemConfig.map(elem => {
            const e2 = tools.newVersionOf(elem);
            e2.alreadyOwned = Items.ownsItemId(ownedItems, e2.id);
            e2.visible = this.canShowItem(e2);
            return e2;
        });
        availableItems = availableItems.filter((e1) => (e1.visible));
        availableItems.sort((e1, e2) => {
            if (e1.alreadyOwned && !e2.alreadyOwned) return 1;
            if (e2.alreadyOwned && !e1.alreadyOwned) return -1;
            return e2.alreadyOwned ? e2.price - e1.price : e1.price - e2.price;
        });
        return availableItems;
    }

    canShowItem(item) {
        return Require.Validate(item.showIf, this.props.meta);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.items !== this.props.items) {
            this.setState({ shopItems: this.findAvailableItems()});
        }
    }

    onBuy(item) {
        ReactGA.event({
            category: 'shop',
            action: 'buy-item',
            label: item.id,
            value: item.price
        });
        this.props.dispatch(buyItem(item));
        Sound.playSound(Sound.BUY_ITEM);
    }

    render() {
        const itemList = this.state.shopItems.map(item => <ShopItem key={item.id}
            item={item}
            onBuy={this.onBuy}
            canAfford={item.price <= this.props.wallet.credits}
            alreadyOwned={Items.ownsItemId(this.props.items, item.id)}
        />);

        return <div className="shop"><h3>Shop</h3><center>{itemList}</center></div>;
    }

}

function mapStateToProps(state) {
    return {
        wallet: state.meta.wallet,
        items: state.meta.items,
        features: state.meta.features,
        meta: state.meta,
    }
}

export default connect(mapStateToProps)(ScreenShop);
