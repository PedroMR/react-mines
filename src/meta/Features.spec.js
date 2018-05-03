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

    expect(Features.hasFeature(meta, types.FEATURE_EXPAND)).toBeTruthy();
    expect(Features.hasFeature(meta, types.FEATURE_ZERO_OUT)).toBeFalsy();
})


const levelData = [
    {
        config: {x: 6, y: 6, mines: 6},
        effects: [
            {feature: 'mines-feature-zero-first'},
        ]
    },
    {
        config: {x: 10, y: 8, mines: 10},
    },
];


test('basic level feature checking', ()=> {
    tools.useLevelDatabase(levelData);
    let meta = { current: { level: 0 }};

    expect(Features.hasFeature(meta, 'mines-feature-zero-first')).toBeTruthy();
    expect(Features.hasFeature(meta, 'my-NON-feature')).toBeFalsy();

    meta.current.level = 1;

    expect(Features.hasFeature(meta, 'mines-feature-zero-first')).toBeFalsy();
    expect(Features.hasFeature(meta, 'my-NON-feature')).toBeFalsy();

})
