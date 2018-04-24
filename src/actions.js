import * as types from "./types";

export const startNewGame = (config) => ({
    type: types.NEW_GAME,
    config
});

export const flagTile = (x, y) => ({
    type: types.FLAG_TILE,
    payload: { x, y }
});

export const revealTile = (x, y) => ({
    type: types.REVEAL_TILE,
    payload: { x, y }
});

export const setUiMode = (mode) => ({
    type: types.SET_UI_MODE,
    payload: { mode }
});