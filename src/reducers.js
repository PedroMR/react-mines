import {combineReducers} from 'redux';
import gameReducer from './mines/MinesReducer';
import metaReducer from './meta/MetaReducer';

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


const reducer = combineReducers({
    meta: metaReducer,
    game: gameReducer
});




export default reducer;