import seedrandom from 'seedrandom';
import * as types from '../types';
import * as tools from '../Tools';

const initialConfig = {
    x: 5,
    y: 5,
    mines: 3,
};

export const initialGameState = { config: initialConfig };

function createGameState(config, seed = Math.random(), safeX = -1, safeY = -1, safeRadius = 1) {
    if (!config) config = initialConfig;
    
    let rand = new seedrandom(seed);

    let cols = config.x;
    let rows = config.y;
    const tiles = cols*rows;
    config.mines = Math.min(
            Math.max(config.mines, Math.ceil(tiles/10)), 
            Math.floor(tiles/3));

    let nMines = config.mines;
    let nRedMines = config.redmines;

    const getRandomInt = (i) => (Math.floor(i*rand.quick()));

    let state = {}
    state.options = { uiMode: types.UI_MODE_REVEAL, autoClickTimer: 2000 };
    state.config = {...config};
    state.seen = Array(cols*rows).fill(false);
    state.around = Array(cols*rows).fill(0);
    state.mines = Array(cols*rows).fill(false);
    state.flags = Array(cols*rows).fill(false);
    state.special = Array(cols*rows).fill(null);
    state.clicksSoFar = 0;
    state.gameOver = false;

    while(nMines > 0) {
        let randX = getRandomInt(cols);
        let randY = getRandomInt(rows);

        if (safeY > -1) {
            if (Math.abs(randX - safeX) <= safeRadius || 
                Math.abs(randY - safeY) <= safeRadius)
                continue;
        }

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

    let attempts = 0;

    while (nRedMines > 0) {
        let randX = getRandomInt(cols);
        let randY = getRandomInt(rows);
        const radius = 5;
        const requiredClues = 5;

        let pos = randX+cols*randY;
        if (!state.special[pos]) {
            let candidates = [];
            for (let dy = -radius; dy <= radius; dy++) {
                const xRadius = radius-Math.abs(dy);
                if (randY + dy < 0 || randY + dy >= rows) continue;
                for (let dx = -xRadius; dx <= xRadius; dx += xRadius*2) {
                    if (randX + dx < 0 || randX + dx >= cols) continue;                        
                    let dPos =  pos + dx + dy*cols;
                    if (!state.special[dPos])
                        candidates.push(dPos);
                    if (xRadius === 0)
                        break;
                }
            }
            if (candidates.length < requiredClues) {
                attempts++;
                console.log("attempts", attempts);
                if (attempts > 10000) {
                    nRedMines = 0;
                }
                continue;
            }
            
            nRedMines--;
            state.special[pos] = 'red';
            let nClues = requiredClues;
            console.log("clues req ",nClues);
            while (nClues > 0) {
                let clueIndex = getRandomInt(candidates.length);
                let cluePos = candidates[clueIndex];
                console.log(candidates);
                candidates.splice(clueIndex, 1);
                console.log(candidates);
                state.special[cluePos] = 'redClue';
                nClues--;
                console.log("clue Pos ", cluePos, "clues req ",nClues);
            }
        }
    }
    console.log("attempts", attempts);

    return state;
}

export function gameReducer(state = initialGameState, action) {
    const payload = action.payload;
    console.log(action);
    switch(action.type) {
        case types.NEW_GAME:
            return createGameState(payload.config, payload.seed, payload.safeX, payload.safeY, payload.safeRadius);
            
        case types.FLAG_TILE:
            if (state.gameOver) return state;

            const flaggedState = handleFlagTile(state, payload.x, payload.y, payload.val);
            checkGameOver(flaggedState);
            return flaggedState;
            
        case types.REVEAL_TILE:
            if (state.gameOver) return state;
            
            const newState = handleRevealTile(state, payload.x, payload.y);

            checkGameOver(newState);
            return newState;

        case types.SET_UI_MODE:
            if (state.gameOver) return state;

            const modes = [ types.UI_MODE_FLAG, types.UI_MODE_REVEAL, types.UI_MODE_MARK_RED ];
            if (modes.indexOf(payload.mode) < 0) {
                console.log("invalid ui mode. ", action);
                return state;
            }
            
            const options = tools.newVersionOf(state.options, {uiMode: payload.mode});
            return tools.newVersionOf(state, {options});

        case types.CLAIM_CREDITS:
            return tools.newVersionOf(state, {claimedRewards: true});

        case types.RESET_PROFILE:
            return initialGameState;

        default:
            return state;
    }
}

function handleFlagTile(state, x, y, val) {
    const pos = getPos(state, x, y);

    if (state.seen[pos]) return state; // can't flag seen tile

    val = val !== undefined ? val : !state.flags[pos];

    if (!state.flags[pos] && flagsRemaining(state) <= 0) {
        // can't place flag here! too many flags down.
        return state;
    }

    let flags = state.flags.slice();
    flags[pos] = !flags[pos];
    return tools.newVersionOf(state, {flags});
}

function handleRevealTile(state, x, y) {
    const pos = getPos(state, x, y);
    if (state.seen[pos]) return state; // revealing a seen tile

    let seen = state.seen.slice();
    seen[pos] = true;
    return tools.newVersionOf(state, {seen, clicksSoFar: state.clicksSoFar+1});
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
    if (newState.gameOver !== true && tilesRemaining(newState) <= 0) {
        // calculateScore(newState);
        newState.gameOver = true;
        newState.claimedRewards = false;
    }
    return newState;
}

export default gameReducer;