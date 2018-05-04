import * as types from "../types";

const allLevels = [
    {
        config: {x: 6, y: 6, mines: 6},
        effects: [
            {feature: types.FEATURE_ZERO_FIRST_CLICK},
        ]
    },
    {
        config: {x: 10, y: 8, mines: 10},
    },
    {
        config: {x: 10, y: 10, mineRatio: 0.14},
    },
    {
        config: {x: 12, y: 10, mineRatio: 0.16},
    },
    {
        config: {x: 14, y: 10, mineRatio: 0.17},
    },
];

export default allLevels;