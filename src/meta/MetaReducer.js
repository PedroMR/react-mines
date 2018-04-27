import * as types from '../types';
import * as tools from '../Tools';

/* config layoutL:
 * state.
 *   .meta
 *      .screen -> current menu we're looking at (main, mines, shop?... etc other crazy stuff)
 *      .features
 *      .wallet
 *          .credits
 *   .game
 *      .seen
 *      .around
 *      .mines
 *      .flags
 *      .gameOver
 *      .options
 *      .config //static, was used to create current game
 */


export const initialMetaState = {
    screen: types.SCREEN_MAIN,
    features: { [types.FEATURE_EXPAND]: true, [types.FEATURE_ZERO_OUT]: true },
    score: {
        perMineFound: 5,
        perMineDetonated: -10,
    },
};


export function metaReducer(state = initialMetaState, action) {
    const payload = action.payload;
    switch (action.type) {

        case types.DEBUG_TOGGLE_FEATURE:
            const feature = payload.feature;
            const turnOn = payload.turnOn === undefined ? !state.features[feature] : payload.turnOn;
            const features = tools.newVersionOf(state.features, {[feature]: turnOn});
            console.log(feature, features, state);
            return tools.newVersionOf(state, {features});

        case types.RESET_PROFILE:
            return initialMetaState;

        case types.CHANGE_SCREEN:
            return tools.newVersionOf(state, {screen: payload.screen});

        case types.DEBUG_ADD_CREDITS:
        case types.CLAIM_CREDITS:
            return tools.addCredits(state, action.payload.amount);

        default:
            return state;
    }
}


export default metaReducer;