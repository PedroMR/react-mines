import dotProp from 'dot-prop-immutable';
import realItems from '../conf/ItemDatabase';
import {Validate} from './Require';

let items = realItems;

function useItemDatabase(itemDB) {
    items = itemDB;
}

function getItemDefinitions() {
    return items.items;
}

function getToolDefinitions() {
    return items.tools;
}

function findItemById(itemId) {
    return items.items.find( e =>  e.id === itemId );
}

function findToolById(itemId) {
    return items.tools.find( e =>  e.id === itemId );
}

function ownsItemId(items, itemId) {
    if (!items) return false;
    if (!itemId || !Array.isArray(items)) {
        console.error("invalid arguments; items is "+items);
    } 

    return items.indexOf(itemId) >= 0;
}

function purchaseItem(state, itemId, price) {
    const item = findItemById(itemId);
    if (!item) {
        console.error("item "+itemId+" not found");
        return state;
    }
    price = price || item.price;

    const creditSource = 'wallet.credits';
    const creditsAvailable = dotProp.get(state, creditSource, 0);
    if (creditsAvailable < price) {
        console.error('not enough currency for '+itemId, 'required '+price, 'had only '+creditsAvailable);
        return state;
    }

    console.log('state items', state.items);
    let newState = state.items ? state : dotProp.set(state, 'items', []);
    newState = dotProp.merge(newState, 'items', itemId);
    newState = dotProp.set(newState, 'wallet.credits', creditsAvailable - price);

    for(let effect of item.effects) {
        if (effect.feature) {
            // Features don't get set from here -- they're polled via tools.hasFeature(), below.
        }
        if (effect.maxLevel) {
            newState.maxLevel = Math.max(newState.maxLevel, effect.maxLevel);
        }
        if (!newState.score) {
            newState.score = {};
        }
        if (effect.scoreMultiplier) {
            if (!(effect.scoreMultiplier <= newState.score.multiplier)) { // ! <= to avoid undefined
                newState = dotProp.set(newState, 'score.multiplier', effect.scoreMultiplier);
            }
        }
    }

    return newState;
}

function getBestMultiplier(myItems)
{
    let bestMultiplier = 1;

    for (let itemId of myItems) {
        const item = findItemById(itemId);
        if (!item) continue;

        for (let effect of item.effects) {
            if (effect.scoreMultiplier) {
                bestMultiplier = Math.max(bestMultiplier, effect.scoreMultiplier);
            }
        }
    }

    return bestMultiplier;
}

function countPurchaseableItems(meta)
{
    const ownedItems = meta.items;

    const {wallet} = meta;

    const ownItem = (item) => ownsItemId(ownedItems, item.id);
    const canSeeItem = (item) => Validate(item.showIf, meta);
    const canAffordItem = (item) => item.price <= wallet.credits;
    const canBuyItem = (item) => canSeeItem(item) && canAffordItem(item) && !ownItem(item);
    const countAvailable = (acc, item) => acc = canBuyItem(item) ? (acc+1) : acc;

    const availableItemsCount = items.items.reduce(countAvailable, 0);
    return availableItemsCount;
}

function getToolAmount(state, itemId) {
    return dotProp.get(state, 'tools.'+itemId, 0);
}

function setToolAmount(state, itemId, amount) {
    return dotProp.set(state, 'tools.'+itemId, amount);
}

function increaseToolAmount(state, itemId, amount = 1) {
    const previousAmount = getToolAmount(state, itemId);
    let newAmount = previousAmount + amount; //TODO check bounds (both min and max)
    return dotProp.set(state, 'tools.'+itemId, newAmount);
}

function decreaseToolAmount(state, itemId, amount = 1) {
    return increaseToolAmount(state, itemId, -amount);
}

function purchaseTool(state, itemId, price) {
    const item = findToolById(itemId);
    if (!item) {
        console.error("item "+itemId+" not found");
        return state;
    }
    price = price || item.price;

    const creditSource = 'wallet.credits';
    const creditsAvailable = dotProp.get(state, creditSource, 0);
    if (creditsAvailable < price) {
        console.error('not enough currency for '+itemId, 'required '+price, 'had only '+creditsAvailable);
        return state;
    }

    let newState = increaseToolAmount(state, itemId);
    newState = dotProp.set(newState, 'wallet.credits', creditsAvailable - price);

    return newState;
}

let Items = {
    purchaseItem,
    useItemDatabase,
    findItemById,
    ownsItemId,
    getBestMultiplier,
    countPurchaseableItems,
    findToolById,
    purchaseTool,
    increaseToolAmount,
    decreaseToolAmount,
    getToolAmount,
    getItemDefinitions,
    getToolDefinitions,
    setToolAmount,
}

export default Items;