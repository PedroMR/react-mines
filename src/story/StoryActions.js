import * as types from '../types';

export const showDialogueLine = (lineId) => ({
    type: types.SHOW_DIALOGUE_LINE,
    payload: { lineId }
});
