import * as tools from '../Tools';
import realItems from '../conf/ItemDatabase';
import realLevels from '../conf/LevelDatabase';
import Items from './Items';

let items = realItems;
let levels = realLevels;

function useItemDatabase(itemDB) {
    items = itemDB;
    Items.useItemDatabase(itemDB);
}

function useLevelDatabase(levelsDB) {
    levels = levelsDB;
}

function hasFeature(meta, featureId) {
    if (hasFeatureInProfile(meta, featureId))
        return true;

    if (hasFeatureInItems(meta, featureId))
        return true;

    if (hasFeatureInLevel(meta, featureId))
        return true;

    return false;
}

function hasFeatureInProfile(meta, featureId) {
    return (meta.features && meta.features[featureId]);
}

function hasFeatureInItems(meta, featureId) {
    if (meta.items) {
        for (let itemId of meta.items) {
            const item = Items.findItemById(itemId);
            if (!item.effects) continue;
            for(let effect of item.effects) {
                if (effect.feature === featureId)
                    return true;
            }
        }
    }

    return false;
}

function hasFeatureInLevel(meta, featureId) {
    if (!meta.current) return false;

    const level = levels[meta.current.level];
    if (!level) return false;
    if (!level.effects) return false;

    for(let effect of level.effects) {
        if (effect.feature === featureId)
            return true;
    }

    return false;
}

let Features = {
    hasFeature,
    useItemDatabase,
    useLevelDatabase,
}

export default Features;