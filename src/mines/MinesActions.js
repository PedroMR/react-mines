import * as types from "../types";

export const startNewGame = (config, safeX, safeY, safeRadius) => ({
    type: types.NEW_GAME,
    payload: { config, safeX, safeY, safeRadius }
});

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
