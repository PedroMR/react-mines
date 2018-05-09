import * as dotProp from 'dot-prop-immutable'
import * as types from '../types';
import * as tools from '../Tools';
import Items from './Items';
import Story from '../story/Story';

/* config layoutL:
 * state.
 *   .meta
 *      .screen -> current menu we're looking at (main, mines, shop?... etc other crazy stuff)
 *      .level -> max unlocked level
 *      .currentLevel -> level being played
 *      .items -> array of owned item ids
 *      .wallet -> currencies
 *          .credits
 *      .score -> score variables
 *      .story
 *          .queue
 *          .read
 *          .flags
 *   .game
 *      .seen
 *      .around
 *      .mines
 *      .flags
 *      .gameOver
 *      .options
 *      .config //static, was used to create current game
 */

export const initialMetaState = Story.enqueueInitialLine({
    current: {
        screen: types.SCREEN_MAIN,
        level: 0,
        visible: {},
    },
    maxLevel: 0,
    features: {},// { [types.FEATURE_EXPAND]: true, [types.FEATURE_ZERO_OUT]: true },
    story: {
        read: {},
        queue: [],
        flags: {},
    },
    items: [], // list of IDs bought already
    wallet: {},
    score: {
        perMineFound: 5,
        perMineDetonated: -10,
        multiplier: 1,
    },
});

function metaReducer(state = initialMetaState, action) {
    let newState = basicMetaReducer(state, action);

    newState = Story.trigger(newState, action, state);
    
    return newState;
}

function basicMetaReducer(state = initialMetaState, action) {
    const payload = action.payload;
    switch (action.type) {

        case types.DEBUG_TOGGLE_FEATURE:
            const feature = payload.feature;
            const dotPath = "features."+feature;

            const turnOn = payload.turnOn === undefined ? !dotProp.get(state, dotPath) : payload.turnOn;
            return dotProp.set(state, dotPath, turnOn);

        case types.RESET_PROFILE:
            return initialMetaState;

        case types.CHANGE_SCREEN:
            return dotProp.set(state, "current.screen", payload.screen);

        case types.SELECT_LEVEL:
            return dotProp.set(state, "current.level", payload.levelNumber);

        case types.NEW_GAME: //TODO rename this to work for multiple games
            return dotProp.set( state, 'current.screen', types.SCREEN_PLAY_MINES);    
        
        case types.DEBUG_ADD_CREDITS:
        case types.CLAIM_CREDITS:
            return tools.addCredits(state, action.payload.amount);

        case types.BUY_ITEM:
            return purchaseItem(state, payload.itemId, payload.price);

        case types.SHOW_DIALOGUE_LINE:
            return Story.enqueueLine(state, payload.lineId);

        default:
            return state;
    }
}

function purchaseItem(state, itemId, price) {
    const theItem = Items.findItemById(itemId);
    price = price || theItem.price;

    if (!theItem) {
        console.log("Can't find item "+itemId);
        return state;
    }
    if (Items.ownsItemId(state.items, itemId)) {
        console.log("Already owns "+itemId);
        return state;
    }
    if (state.wallet.credits < price) {
        console.log("Can't buy, price "+price+" too high; wallet "+state.wallet.credits);
        return state;
    }

    return Items.purchaseItem(state, itemId, price);
}


export default metaReducer;