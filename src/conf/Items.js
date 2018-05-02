
import * as types from "../types";

const allItems = [
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
        effects: [{ level: 1 }]
    },
]

export default allItems;