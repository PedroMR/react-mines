
import * as types from "../types";
import {OwnsItem, Not} from '../meta/Require';

const allItems = [
    {
        id: 'auto-zero',
        name: "Auto Zeroes",
        price: 15,
        description: "Automatically reveal all neighbors to a zero tile.",
        effects: [{ feature: types.FEATURE_ZERO_OUT }]
    },{
        id: 'blank-zeroes',
        name: "Blank Zeroes",
        price: 5,
        description: "Make all zero tiles blank. It's just an aesthetic thing, really.",
        effects: [{ feature: types.FEATURE_BLANK_ZEROES }]
    },{
        id: 'expand-safe',
        name: "Safe Expanding",
        price: 75,
        description: "Click a number to automatically reveal all its neighbors if it's considered safe.",
        effects: [{ feature: types.FEATURE_EXPAND }]
    },{
        id: 'level-1',
        name: "Unlock the next level",
        price: 45,
        description: "More tiles, more mines, more rewards.",
        effects: [{ maxLevel: 1 }]
    },{
        id: 'level-2',
        name: "Raise the roof!",
        price: 110,
        description: "It's getting hot in here... defuse more mines!",
        effects: [{ maxLevel: 2 }],
        showIf: [
            OwnsItem('level-1'),
        ],
    },
]

export default allItems;