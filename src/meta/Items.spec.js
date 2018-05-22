import * as types from '../types';
import Items from './Items';
import * as tools from '../Tools';

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
],tools:[
    {
        id: 'tool1',
        price: 50,
    }
]
}


test('can find items', () => {
    Items.useItemDatabase(itemData);
    const itemId = 'expand-safe';

    expect(Items.findItemById(itemId)).toEqual(itemData.items[1]);
    expect(Items.findItemById('non-existant id')).toEqual(undefined);
})

test('count purchaseable items', () => {
    Items.useItemDatabase(itemData);
    const meta = MakeWallet(100);
    expect(Items.countPurchaseableItems(meta)).toEqual(3);
    const meta2 = MakeWallet(20);
    expect(Items.countPurchaseableItems(meta2)).toEqual(1);

})

test('can purchase items', () => {
    Items.useItemDatabase(itemData);
    const itemId = 'expand-safe';
    const meta = MakeWallet(100);
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

test('item score multiplier', ()=> {
    Items.useItemDatabase(itemData);
    const itemId = 'multi-2';
    const meta = { items: [], maxLevel: 0, wallet: {credits: 500} };
    const retVal  = Items.purchaseItem(meta, itemId);

    expect(tools.scoreMultiplier(meta)).toBe(1);

    expect(retVal.wallet).toEqual({credits: 325});
    expect(retVal.items).toContain(itemId);
    expect(tools.scoreMultiplier(retVal)).toBe(2);
})

describe('tools', () => {
    beforeAll(() => Items.useItemDatabase(itemData));
    test('find definition', () => {
        var tool = Items.findToolById('tool1')
        expect(tool).not.toBe(undefined);
        expect(tool.price).toEqual(50);
        
        expect(Items.findToolById('no-tool-here')).toBe(undefined);
    })

    test('can buy tool', () => {
        const meta = { tools: {}, maxLevel: 0, wallet: {credits: 500} };
        let retVal  = Items.purchaseTool(meta, 'tool1');
        
        expect(retVal.wallet).toEqual({credits: 450});
        expect(retVal.tools.tool1).toEqual(1);

        retVal  = Items.purchaseTool(retVal, 'tool1');
        
        expect(retVal.wallet).toEqual({credits: 400});
        expect(retVal.tools.tool1).toEqual(2);

    })
})

function MakeWallet(amount) {
    return { wallet: {credits: amount} };
}