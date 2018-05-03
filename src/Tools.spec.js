import * as types from './types';
import * as tools from './Tools';

test('get credits', () => {
    expect(tools.getCredits({wallet: {credits: 100}})).toBe(100);
    expect(tools.getCredits({})).toBe(0);
});

test('add credits to wallet', () => {
    const amount = 10;
    const base = 6;
    const baseWallet = {wallet: {credits: base}};
    const emptyWalletPlusAmount = {wallet: {credits: amount}};
    const baseWalletPlusAmount = {wallet: {credits: base + amount}};
    expect(tools.addCredits({}, amount)).toEqual(emptyWalletPlusAmount);
    expect(tools.addCredits({wallet: {}}, amount)).toEqual(emptyWalletPlusAmount);
    expect(tools.addCredits(baseWallet, amount)).toEqual(baseWalletPlusAmount);
})

test('adding credits does not mutate wallet', ()=> {
    const amount = 10;
    const base = 2;
    const baseWallet = {wallet: {credits: base}};
    const baseWalletPlusAmount = {wallet: {credits: base + amount}};

    expect(tools.addCredits(baseWallet, amount)).toEqual(baseWalletPlusAmount);
    expect(baseWallet).not.toEqual(baseWalletPlusAmount);
})

test('scoring a mines game', () => {
    const results = {nMinesFound: 5, nMinesDetonated: 1};
    
    const score1 = undefined;
    const score2 = {};
    const score3 = {perMineFound: 5};
    expect(tools.totalScoreFor(score1, results)).toEqual(15);
    expect(tools.totalScoreFor(score2, results)).toEqual(15);
    expect(tools.totalScoreFor(score3, results)).toEqual(15);

    const score4 = {perMineFound: 10};
    expect(tools.totalScoreFor(score4, results)).toEqual(40);

})

const itemData = [
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
    },
]

test('can find items', () => {
    tools.useItemDatabase(itemData);
    const itemId = 'expand-safe';

    expect(tools.findItemById(itemId)).toEqual(itemData[1]);
    expect(tools.findItemById('non-existant id')).toEqual(undefined);
})

test('can purchase items', () => {
    tools.useItemDatabase(itemData);
    const itemId = 'expand-safe';
    const meta = { items: [], wallet: {credits: 100} };
    const retVal  = tools.purchaseItem(meta, itemId);

    expect(retVal.items).toEqual([itemId]);
    expect(retVal.wallet).toEqual({credits: 55});
    expect(tools.purchaseItem(meta, 'non-existant id')).toBe(meta);
})

test('basic feature checking', ()=> {
    const meta = { features: {['my-feature']: true }};

    expect(tools.hasFeature(meta, 'my-feature')).toBeTruthy();
    expect(tools.hasFeature(meta, 'my-NON-feature')).toBeFalsy();
})

test('empy item list feature checking', ()=> {
    const meta = { items: [], features: {['my-feature']: true }};

    expect(tools.hasFeature(meta, 'my-feature')).toBeTruthy();
    expect(tools.hasFeature(meta, 'my-NON-feature')).toBeFalsy();
})

test('item list feature checking', ()=> {
    const meta = { items: ['expand-safe'] };

    expect(tools.hasFeature(meta, types.FEATURE_EXPAND)).toBeTruthy();
    expect(tools.hasFeature(meta, types.FEATURE_ZERO_OUT)).toBeFalsy();
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

    expect(tools.hasFeature(meta, 'mines-feature-zero-first')).toBeTruthy();
    expect(tools.hasFeature(meta, 'my-NON-feature')).toBeFalsy();

    meta.current.level = 1;

    expect(tools.hasFeature(meta, 'mines-feature-zero-first')).toBeFalsy();
    expect(tools.hasFeature(meta, 'my-NON-feature')).toBeFalsy();

})

test('item level unlocking', ()=> {
    tools.useItemDatabase(itemData);
    const itemId = 'level-1';
    const meta = { items: [], maxLevel: 0, wallet: {credits: 100} };
    const retVal  = tools.purchaseItem(meta, itemId);

    expect(retVal.wallet).toEqual({credits: 25});
    expect(retVal.items).toContain(itemId);
    expect(retVal.maxLevel).toBe(1);
})