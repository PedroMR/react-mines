
const initialConfig = {
    x: 10,
    y: 10,
    mines: 8,
};

const initialState = createGameState(initialConfig);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createGameState(config) {
    let cols = config.x;
    let rows = config.y;
    config.mines = Math.min(config.mines, cols * rows);

    let nMines = config.mines;

    let state = {}
    state.options = { placingFlag: false };
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

function reducer(state = initialState, action) {
    console.log(action);
    switch(action.type) {
        case "NEWGAME":
            return createGameState(action.config);
        case "INSPECT":
            if (state.gameOver) return state;

            var newState = handleUserSelected(state, action.x, action.y);
            if (tilesRemaining(newState) <= 0) {
                newState.gameOver = true;
            }
            return newState;
            // let seen = state.seen.slice();
            // seen[getPos(state, action.x, action.y)] = true;
            // return Object.assign({}, state, {seen: seen});
        case "TOGGLEFLAG":
            if (state.gameOver) return state;

            let options = Object.assign({}, state.options, {placingFlag: !state.options.placingFlag});
            return Object.assign({}, state, {options: options});
        default:
            return state;
    }
}

function handleUserSelected(state, x, y) {
    const pos = getPos(state, x, y);
    let seen = state.seen.slice();

    if (!seen[pos]) {
        if (state.options.placingFlag) {
            if (!state.flags[pos] && flagsRemaining(state) <= 0) {
                // can't place flag here! too many flags down.
                return state;
            }

            let flags = state.flags.slice();
            flags[pos] = !flags[pos];
            return Object.assign({}, state, {flags: flags});
        } else {
            if (state.flags[pos]) // clicked a flag! no-no
                return state;
            
            seen[pos] = true;
            if (state.around[pos] === 0)
                expandAround(state, x, y, seen);
            return Object.assign({}, state, {seen: seen});
        }
    } else {
        //expand
        var flagsAround = countFlagsAndVisibleMinesAround(state, x, y);
        if (flagsAround === state.around[pos]) {
            expandAround(state, x, y, seen);
            return Object.assign({}, state, {seen: seen});
        }
    }

    return state;
}

function expandAround(state, x, y, seen) {
    let cols = state.config.x;
    let rows = state.config.y;
    seen = seen || state.seen.slice();        

    for (let dy=-1; dy <= 1; dy++) {
        if (y + dy < 0 || y + dy >= rows) continue;
        for (let dx=-1; dx <= 1; dx++) {
            if (x + dx < 0 || x + dx >= cols) continue;                        
            if (dx === dy && dx === 0) continue;

            let neighborPos =  x + dx + (y+dy)*cols;
            if (!state.flags[neighborPos] && !seen[neighborPos]) {
                seen[neighborPos] = true;
                if (state.around[neighborPos] === 0) {
                    expandAround(state, x+dx,y+dy, seen);
                }
            }
        }
    }
}

function countFlagsAndVisibleMinesAround(state, x, y) {
    let n = 0;
    let cols = state.config.x;
    let rows = state.config.y;

    for (let dy=-1; dy <= 1; dy++) {
        if (y + dy < 0 || y + dy >= rows) continue;
        for (let dx=-1; dx <= 1; dx++) {
            if (x + dx < 0 || x + dx >= cols) continue;                        
            if (dx === dy && dx === 0) continue;

            let neighborPos =  x + dx + (y+dy)*cols;
            if (state.flags[neighborPos])
                n++; // count flag
            else if (state.mines[neighborPos] && state.seen[neighborPos])
                n++; // count visible mine
        }
    }

    return n;
}

export default reducer;