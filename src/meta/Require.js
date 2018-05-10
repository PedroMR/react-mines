import Items from './Items';
import Features from './Features';


export function OwnsItem(itemId) {
    return function(meta) {
        return Items.ownsItemId(meta.items, itemId);
    }
}

export function OnScreen(screen) {
    return function(meta) {
        return meta.current.screen === screen;
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

export function Never() {
    return () => false;
}

export function Validate(requirements, ...args) {
    if (requirements === undefined) return true;

    if (!Array.isArray(requirements)) {
        if (typeof requirements === 'object') {
            const isNegated = requirements.Not;

            if (requirements.OwnsItem) {
                requirements = OwnsItem(requirements.OwnsItem);
            } else if(requirements.UnlockedLevel) {
                requirements = UnlockedLevel(requirements.UnlockedLevel);
            } else if (requirements.HasFeature) {
                requirements = HasFeature(requirements.HasFeature);
            }

            if (isNegated) requirements = Not(requirements);
        }

        if (typeof requirements === 'function')
            return requirements(...args);
    }

    for (let requirement of requirements) {
        if (!Validate(requirement, ...args))
            return false;
    }

    return true;
}