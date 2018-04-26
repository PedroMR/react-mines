import * as types from "./types";

export const startNewGame = (config) => ({
    type: types.NEW_GAME,
    payload: { config }
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

export const debugToggleFeature = (feature, turnOn) => ({
    type: types.DEBUG_TOGGLE_FEATURE,
    payload: { feature, turnOn }
});

export const debugAddCredits = (amount) => ({
    type: types.DEBUG_ADD_CREDITS,
    payload: { amount }
});

export const resetProfile = () => ({
    type: types.RESET_PROFILE,
});

export const claimCredits = (amount) => ({
    type: types.CLAIM_CREDITS,
    payload: { amount }
});

export const gotoMainMenu = () => ({
    type: types.GOTO_MAINMENU,
});