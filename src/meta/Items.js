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
        console.log(effect.scoreMultiplier, newState.score.multiplier);
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


let Items = {
    purchaseItem,
    useItemDatabase,
    findItemById,
    ownsItemId,
    getBestMultiplier,
}

export default Items;