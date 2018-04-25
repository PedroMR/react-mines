import * as types from './types';
import { initialMetaState } from './reducers';

export function scoreForMinesFound(score, amount) {
    console.log('found',score, initialMetaState);
    // let ratio = score != undefined ? score.perMineFound : initialMetaState.score.perMineFound;
    let ratio = initialMetaState.score.perMineFound;
    return ratio * amount;
}

export function scoreForMinesDetonated(score, amount) {
    // let ratio = score != undefined ? score.perMineDetonated : initialMetaState.score.perMineDetonated;
    let ratio = initialMetaState.score.perMineDetonated;
    
    return ratio * amount;
}

export function getCredits(meta) {
    if (meta.wallet) {
        return meta.wallet.credits;
    }
    return 0;
}