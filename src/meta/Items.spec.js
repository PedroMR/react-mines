import * as types from '../types';
import Items from './Items';

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
    Items.useItemDatabase(itemData);
    const itemId = 'expand-safe';

    expect(Items.findItemById(itemId)).toEqual(itemData[1]);
    expect(Items.findItemById('non-existant id')).toEqual(undefined);
})

test('can purchase items', () => {
    Items.useItemDatabase(itemData);
    const itemId = 'expand-safe';
    const meta = { items: [], wallet: {credits: 100} };
    const retVal  = Items.purchaseItem(meta, itemId);

    expect(retVal.items).toEqual([itemId]);
    expect(retVal.wallet).toEqual({credits: 55});
    expect(Items.purchaseItem(meta, 'non-existant id')).toBe(meta);
})

test('item level unlocking', ()=> {
    Items.useItemDatabase(itemData);
    const itemId = 'level-1';
    const meta = { items: [], maxLevel: 0, wallet: {credits: 100} };
    const retVal  = Items.purchaseItem(meta, itemId);

    expect(retVal.wallet).toEqual({credits: 25});
    expect(retVal.items).toContain(itemId);
    expect(retVal.maxLevel).toBe(1);
})