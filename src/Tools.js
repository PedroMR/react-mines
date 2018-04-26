import * as types from './types';
import { initialMetaState } from './reducers';

export function scoreForMinesFound(score, amount) {
    console.log('found',score, initialMetaState);
    const ratio = scoreMultiplierForMinesFound(score);

    return ratio * amount;
}

export function scoreMultiplierForMinesFound(score) {
    return score != undefined ? score.perMineFound : initialMetaState.score.perMineFound;
}

export function scoreForMinesDetonated(score, amount) {
    const ratio = scoreMultiplierForMinesDetonated(score);
    
    return ratio * amount;
}

export function scoreMultiplierForMinesDetonated(score) {
    return score != undefined ? score.perMineDetonated : initialMetaState.score.perMineDetonated;
}

export function totalScoreFor(score, results) {
    let totalScore = 0;
    totalScore += scoreForMinesFound(score, results.nMinesFound);
    totalScore += scoreForMinesDetonated(score, results.nMinesDetonated);
}

export function getCredits(meta) {
    if (meta.wallet) {
        return meta.wallet.credits;
    }
    return 0;
}

export function addCredits(meta, amount) {
    if (!meta.wallet) {
        meta.wallet = {};
    }
    if (!meta.wallet.credits) {
        meta.wallet.credits = 0;
    }
    meta.wallet.credits += amount;
}
