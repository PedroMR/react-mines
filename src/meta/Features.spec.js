import * as types from '../types';
import * as tools from '../Tools';
import Features from './Features';

test('basic feature checking', ()=> {
    const meta = { features: {['my-feature']: true }};

    expect(Features.hasFeature(meta, 'my-feature')).toBeTruthy();
    expect(Features.hasFeature(meta, 'my-NON-feature')).toBeFalsy();
})

test('empy item list feature checking', ()=> {
    const meta = { items: [], features: {['my-feature']: true }};

    expect(Features.hasFeature(meta, 'my-feature')).toBeTruthy();
    expect(Features.hasFeature(meta, 'my-NON-feature')).toBeFalsy();
})

test('item list feature checking', ()=> {
    const meta = { items: ['expand-safe'] };
    Features.useItemDatabase(itemData);

    expect(Features.hasFeature(meta, types.FEATURE_EXPAND)).toBeTruthy();
    expect(Features.hasFeature(meta, types.FEATURE_ZERO_OUT)).toBeFalsy();
})

test('wrong item list feature checking', ()=> {
    const meta = { items: ['zzZZZzzzexpand-safe'] };
    Features.useItemDatabase(itemData);

    expect(Features.hasFeature(meta, types.FEATURE_EXPAND)).toBeFalsy();
    expect(Features.hasFeature(meta, types.FEATURE_ZERO_OUT)).toBeFalsy();
})


const itemData = {items:[
    {
        id: 'auto-zero',
        name: "Auto Zeroes",
        price: 20,
        description: "Automatically reveal all neighbors to a zero tile.",
        effects: [{ feature: types.FEATURE_ZERO_OUT }]
    },{
        id: 'expand-safe',
        name: "Safe Expanding",
        price: 45,
        description: "Click a number to automatically reveal all its neighbors if it's considered safe.",
        effects: [{ feature: types.FEATURE_EXPAND }]
    },{
        id: 'level-1',
        name: "Unlock the next level",
        price: 75,
        description: "More tiles, more mines, more rewards.",
        effects: [{ maxLevel: 1 }]
    },{
        id: 'multi-2',
        name: "Multiplier",
        price: 175,
        description: "More tiles, more mines, more rewards.",
        effects: [{ scoreMultiplier: 2 }]        
    },
]}

const levelData = [
    {
        config: {x: 6, y: 6, mines: 6},
        effects: [
            {feature: types.FEATURE_CLICK_SURROUNDED},
        ]
    },
    {
        config: {x: 10, y: 8, mines: 10},
    },
];


test('basic level feature checking', ()=> {
    Features.useLevelDatabase(levelData);
    let meta = { current: { level: 0 }};

    expect(Features.hasFeature(meta, types.FEATURE_CLICK_SURROUNDED)).toBeTruthy();
    expect(Features.hasFeature(meta, 'my-NON-feature')).toBeFalsy();

    meta.current.level = 1;

    expect(Features.hasFeature(meta, types.FEATURE_CLICK_SURROUNDED)).toBeFalsy();
    expect(Features.hasFeature(meta, 'my-NON-feature')).toBeFalsy();

})
