import dotProp from 'dot-prop-immutable';
import { initialMetaState } from './meta/MetaReducer';
import items from './conf/Items';

export function scoreForMinesFound(score, amount) {
    console.log('found',score, initialMetaState);
    const ratio = scoreMultiplierForMinesFound(score);

    return ratio * amount;
}

export function scoreMultiplierForMinesFound(score) {
    if (score === undefined || score.perMineFound === undefined) return initialMetaState.score.perMineFound;
    else return score.perMineFound;
}

export function scoreForMinesDetonated(score, amount) {
    const ratio = scoreMultiplierForMinesDetonated(score);
    
    return ratio * amount;
}

export function scoreMultiplierForMinesDetonated(score) {
    if (score === undefined || score.perMineDetonated === undefined) return initialMetaState.score.perMineDetonated;
    else return score.perMineDetonated;
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

export function findItemById(itemId) {
    return items.find( e =>  e.id === itemId );
}

export function ownsItemId(items, itemId) {
    if (!items) return false;
    if (!itemId || !Array.isArray(items)) {
        console.error("invalid arguments; items is "+items);
    } 

    return items.indexOf(itemId) >= 0;
}

export function purchaseItem(state, itemId, price) {
    let newState = dotProp.merge(state, 'items', itemId);
    newState = dotProp.set(newState, 'wallet.credits', state.wallet.credits - price);

    const item = findItemById(itemId);

    console.log(item);
    
    for(let effect of item.effects) {
        console.log("effect ",effect, effect.feature);
        if (effect.feature) {
            newState = dotProp.set(newState, 'features.'+effect.feature, true);
        }
    }

    return newState;
}