import {combineReducers} from 'redux';
import * as types from './types';


/* config layoutL:
 * state.
 *   .meta
 *      .features
 *   .game
 *      .seen
 *      .around
 *      .mines
 *      .flags
 *      .gameOver
 *      .options
 *      .config //static, was used to create current game
 */

const initialConfig = {
    x: 10,
    y: 6,
    mines: 8,
};

const initialGameState = createGameState(initialConfig);
const initialMetaState = {features: { [types.FEATURE_EXPAND]: true, [types.FEATURE_ZERO_OUT]: true }};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createGameState(config) {
    let cols = config.x;
    let rows = config.y;
    config.mines = Math.min(config.mines, cols * rows);

    let nMines = config.mines;

    let state = {}
    state.options = { uiMode: types.UI_MODE_REVEAL };
    state.config = {x: cols, y: rows, mines: nMines};
    state.seen = Array(cols*rows).fill(false);
    state.around = Array(cols*rows).fill(0);
    state.mines = Array(cols*rows).fill(false);
    state.flags = Array(cols*rows).fill(false);
    state.gameOver = false;

    while(nMines > 0) {
        let randX = getRandomInt(cols);
        let randY = getRandomInt(rows);
        let pos = randX+cols*randY;
        if (!state.mines[pos]) {
            nMines--;
            state.mines[pos] = true;
            for (let dy=-1; dy <= 1; dy++) {
                if (randY + dy < 0 || randY + dy >= rows) continue;
                for (let dx=-1; dx <= 1; dx++) {
                    if (randX + dx < 0 || randX + dx >= cols) continue;                        
                    let neighborPos =  pos + dx + dy*cols;
                    state.around[neighborPos]++;
                }
            }
        }
    }

    return state;
}

function getPos(state, x, y) {
    return x + y * state.config.x;
}

function tilesRemaining(state) {
    const countDefined = (acc,val) => (val ? acc+1 : acc);
    const nTiles = state.seen.length;
    const nSeen = state.seen.reduce(countDefined, 0);
    const nFlags = state.flags.reduce(countDefined, 0);

    return nTiles - nSeen - nFlags;
}

function flagsRemaining(state) {
    const countDefined = (acc,val) => (val ? acc+1 : acc);
    const nMines = state.mines.reduce(countDefined, 0);
    const nMinesVisible = state.mines.reduce((acc, val, index) => (val && state.seen[index]) ? acc+1 : acc, 0);
    const nFlagsPlaced = state.flags.reduce(countDefined, 0);

    return nMines - nMinesVisible - nFlagsPlaced;
}

function checkGameOver(newState) {
    if (tilesRemaining(newState) <= 0) {
        newState.gameOver = true;
    }
    return newState;
}

const reducer = combineReducers({
    meta: metaReducer,
    game: gameReducer
});

function gameReducer(state = initialGameState, action) {
    const payload = action.payload;
    console.log(action);
    switch(action.type) {
        case types.NEW_GAME:
            return createGameState(payload.config);
            
        case types.FLAG_TILE:
            if (state.gameOver) return state;

            const flaggedState = handleFlagTile(state, payload.x, payload.y);
            checkGameOver(flaggedState);
            return flaggedState;
            
        case types.REVEAL_TILE:
            if (state.gameOver) return state;

            const newState = handleRevealTile(state, payload.x, payload.y);
            checkGameOver(newState);
            return newState;

        case types.SET_UI_MODE:
            if (state.gameOver) return state;

            const modes = [ types.UI_MODE_FLAG, types.UI_MODE_REVEAL ];
            if (modes.indexOf(payload.mode) < 0) {
                console.log("invalid ui mode. ", action);
                return state;
            }
            
            const options = newVersionOf(state.options, {uiMode: payload.mode});
            return newVersionOf(state, {options});

        case types.RESET_PROFILE:
            return initialGameState;

        default:
            return state;
    }
}

function metaReducer(state = initialMetaState, action) {
    const payload = action.payload;
    switch (action.type) {

        case types.DEBUG_TOGGLE_FEATURE:
            const feature = payload.feature;
            const turnOn = payload.turnOn === undefined ? !state.features[feature] : payload.turnOn;
            const features = newVersionOf(state.features, {[feature]: turnOn});
            console.log(feature, features, state);
            return newVersionOf(state, {features});

        case types.RESET_PROFILE:
            return initialMetaState;

        default:
            return state;
    }
}

function handleFlagTile(state, x, y) {
    const pos = getPos(state, x, y);

    if (state.seen[pos]) return state; // can't flag seen tile

    if (!state.flags[pos] && flagsRemaining(state) <= 0) {
        // can't place flag here! too many flags down.
        return state;
    }

    let flags = state.flags.slice();
    flags[pos] = !flags[pos];
    return newVersionOf(state, {flags});
}

function newVersionOf(obj, newProps) {
    return Object.assign({}, obj, newProps);
}

function handleRevealTile(state, x, y) {
    const pos = getPos(state, x, y);
    if (state.seen[pos]) return state; // revealing a seen tile

    let seen = state.seen.slice();
    seen[pos] = true;
    return newVersionOf(state, {seen});
}

export default reducer;