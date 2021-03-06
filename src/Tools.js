import dotProp from 'dot-prop-immutable';
import Items from './meta/Items';

export function scoreForMinesFound(score, amount) {
    const ratio = scoreMultiplierForMinesFound(score);

    return ratio * amount;
}

export function scoreMultiplierForMinesFound(score) {
    return dotProp.get(score, 'perMineFound', 5);
}

export function scoreForMinesDetonated(score, amount) {
    const ratio = scoreMultiplierForMinesDetonated(score);
    
    return ratio * amount;
}

export function scoreMultiplierForMinesDetonated(score) {
    return dotProp.get(score, 'perMineDetonated', -10);
}

export function scoreMultiplier(meta) {
    return Items.getBestMultiplier(meta.items);
}

export function totalScoreFor(score, results) {
    let totalScore = 0;
    totalScore += scoreForMinesFound(score, results.nMinesFound);
    totalScore += scoreForMinesDetonated(score, results.nMinesDetonated);
    return totalScore;
}

export function getCredits(meta) {
    if (meta.wallet) {
        return meta.wallet.credits;
    }
    return 0;
}

export function addCredits(meta, amount) {
    let wallet = {...meta.wallet};
    if (!meta.wallet) wallet = {credits: 0};
    if (!wallet.credits) wallet.credits = 0;
    wallet.credits += amount;

    return {...meta, wallet};
}

export function newVersionOf(obj, newProps) {
    return Object.assign({}, obj, newProps);
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function formatPrice(amount) {
    return amount+' Ω';
}