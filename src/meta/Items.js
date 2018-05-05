import dotProp from 'dot-prop-immutable';
import realItems from '../conf/ItemDatabase';
import realLevels from '../conf/LevelDatabase';

let items = realItems;
let levels = realLevels;

function useItemDatabase(itemDB) {
    items = itemDB;
}

function findItemById(itemId) {
    return items.find( e =>  e.id === itemId );
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
    let newState = dotProp.merge(state, 'items', itemId);
    newState = dotProp.set(newState, 'wallet.credits', state.wallet.credits - price);

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
        if (effect.scoreMultiplier > newState.score.multiplier) {
            dotProp.set(newState, 'score.multiplier', effect.scoreMultiplier);
        }
    }

    return newState;
}


let Items = {
    purchaseItem,
    useItemDatabase,
    findItemById,
    ownsItemId,
}

export default Items;