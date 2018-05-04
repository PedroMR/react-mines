import * as types from "../types";

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

export const changeScreen = ( screen ) => ({
    type: types.CHANGE_SCREEN,
    payload: { screen }
});

export const selectLevel = ( levelNumber ) => ({
    type: types.SELECT_LEVEL,
    payload: { levelNumber }
});
