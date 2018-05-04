import Items from './Items';

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

export function Not(clause) {
    return function(...args) {
        return !clause(...args);
    }
}

let Require = {
    OwnsItem,
}

export default Require;