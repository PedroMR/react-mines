
import * as types from "../types";

const itemCatalogue = [
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
        id: 'color-code',
        name: "Color Code Numbers",
        price: 175,
        description: "Convenient optics alter the way you perceive numbers depending on the amount of mines vs the amount of unseen tiles. Trust us, you'll like this one.",
        effects: [{ feature: types.FEATURE_COLOR_NUMBERS }]
    },{
        id: 'dont-color-done',
        name: "Information Filtering",
        price: 215,
        description: "Some would think it's not worth paying this much for something that makes things gray. They would be wrong. In an era of information overload filtering things out is-- ...I'll be quiet.",
        effects: [{ feature: types.FEATURE_DONT_COLOR_DONE }],
        showIf: [{OwnsItem:'color-code'}],
    },{
        id: 'click-surrounded',
        name: "You Are Surrounded!",
        price: 350,
        description: '"What if I told you... you could click the RED numbers?"',
        effects: [{ feature: types.FEATURE_CLICK_SURROUNDED }],
        showIf: [{OwnsItem: 'color-code'}],
    },{
        id: 'error-detection',
        name: "Mine Checksum",
        price: 250,
        description: "Are you going faster now? This will help avoid some human mistakes. Don't worry. We won't judge.",
        effects: [{ feature: types.FEATURE_ERROR_DETECTION }],
        showIf: [{UnlockedLevel: 4}],
    },{
        id: 'mine-first-click',
        name: "Mine Mulligan",
        price: 97,
        description: "That felt awful, right? You should never have to hit a mine in your first tap again.",
        effects: [{ feature: types.FEATURE_SAFE_FIRST_CLICK }],
        showIf: [{HasFeature: types.FLAG_DID_HIT_MINE_FIRST_CLICK}, {Not: true, OwnsItem: 'zero-first-click'}],
    },{
        id: 'zero-first-click',
        name: "Starting Safe",
        price: 183,
        description: "You know what's better than not starting with a mine? Starting with a blank.",
        effects: [{ feature: types.FEATURE_ZERO_FIRST_CLICK }],
        showIf: [{OwnsItem:'mine-first-click'}],
    },
    MakeLevelUnlock(1, 50, 1),
    MakeLevelUnlock(2, 110, 1.3),
    MakeLevelUnlock(3, 180, 1.5),
    MakeLevelUnlock(4, 250, 2),
    MakeLevelUnlock(5, 400, 3),
]

function MakeLevelUnlock(num, price, scoreMult) {
    let level = {
        id: 'level-'+num,
        name: "Unlock level "+num,
        price,
        description: "More tiles! More mines! More... REWARDS..." + ((num > 1) ? " including a bigger score multiplier." : ""),
        effects: [{maxLevel: num}, { scoreMultiplier: scoreMult }]
    }
    level.showIf = [ {Not:true, OwnsItem:'level-'+(num+1)} ];
    if (num > 1)
        level.showIf.push({OwnsItem:'level-'+(num-1)});

    return level;
}

const toolCatalogue = [
    {
        id: types.TOOL_KILL_MINE,
        name: 'Mine Killer',
        baseCap: 1,
    },
    {
        id: types.TOOL_MARK_RED,
        name: "Dig Up",
        baseCap: 1,
    },
]

const allItems = {
    items: itemCatalogue,
    tools: toolCatalogue,
}

export default allItems;