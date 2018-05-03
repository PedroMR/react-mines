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
];

export default allLevels;