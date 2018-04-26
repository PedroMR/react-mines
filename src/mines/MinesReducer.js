
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

        case types.CLAIM_CREDITS:
            return newVersionOf(state, {claimedRewards: true});

        case types.RESET_PROFILE:
            return initialGameState;

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

export default gameReducer;