import * as types from "../types";

export const startNewGame = (config, safeX, safeY, safeRadius) => {
    const seed = Math.floor(Math.random()*99999);
    if (config.mineRatio && !config.mines) {
        const mines = Math.floor(config.x * config.y * config.mineRatio);
        config = {...config, mines }; 
        console.log(config);
    }
    return {
        type: types.NEW_GAME,
        payload: { config, seed, safeX, safeY, safeRadius }
}};

export const flagTile = (x, y, val) => ({
    type: types.FLAG_TILE,
    payload: { x, y, val }
});

export const revealTile = (x, y) => ({
    type: types.REVEAL_TILE,
    payload: { x, y }
});

export const setUiMode = (mode) => ({
    type: types.SET_UI_MODE,
    payload: { mode }
});
