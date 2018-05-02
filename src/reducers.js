import {combineReducers} from 'redux';
import minesReducer from './mines/MinesReducer';
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
    mines: minesReducer
});




export default reducer;