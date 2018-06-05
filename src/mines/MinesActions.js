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

export const markTile = (x, y, mark) => ({
    type: types.MARK_TILE,
    payload: { x, y, mark }
});

export const useTool = (x, y, tool) => ({
    type: types.USE_TOOL,
    payload: { x, y, tool }
});

export const revealTile = (x, y) => ({
    type: types.REVEAL_TILE,
    payload: { x, y }
});

export const revealTiles = (positions) => ({
    type: types.REVEAL_TILE,
    payload: { x: -1, y: -1, positions }
});

export const setUiMode = (mode) => ({
    type: types.SET_UI_MODE,
    payload: { mode }
});

export const toggleDisableFeature = (feature) => ({
    type: types.TOGGLE_DISABLE_FEATURE,
    payload: { feature },
})