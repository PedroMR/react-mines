import Items from './Items';
import Features from './Features';


export function OwnsItem(itemId) {
    return function(meta) {
        return Items.ownsItemId(meta.items, itemId);
    }
}

export function UnlockedLevel(levelNumber) {
    return function(meta) {
        return meta.maxLevel >= levelNumber;
    }
}

export function HasFeature(featureId) {
    return function(meta) {
        return Features.hasFeature(meta, featureId);
    }
}

export function Not(clause) {
    return function(...args) {
        return !clause(...args);
    }
}
