import * as types from "../types";
import imgInspect from '../img/magnifying-glass.png';
import imgFlag from '../img/minefield.png';

export const toolCatalogue = [
    {name:"Inspect", desc:"Left-click to see the tile's number", icon: imgInspect, mode: types.UI_MODE_REVEAL, hotkey:"Q" },
    {name:"Flag", desc:"Right-click to mark a tile as a mine", icon: imgFlag, mode: types.UI_MODE_FLAG, hotkey:"W"  },
    {feature:types.FEATURE_RED_MINES, name:"Dig Up Treasure", desc:"Dig a tile for treasure.", icon: imgInspect, mode: types.UI_MODE_MARK_RED, noToggle: true, tool: types.TOOL_MARK_RED, hotkey:"E" },
    {feature:types.FEATURE_MINE_KILLER, name:"Kill a Mine", desc:"Kill a mine if there is one there.", icon: imgFlag, mode: types.UI_MODE_KILL_MINE, noToggle: true, tool: types.TOOL_KILL_MINE, hotkey:"A"  },
];

export const powerCatalogue = [
    {feature:types.FEATURE_ZERO_OUT, name:"Auto-zero", desc:"All neighbors of zero tiles are automatically opened." },
    {feature:types.FEATURE_EXPAND, name:"Safe Expansion", desc:"Click a number which can't have any more mines around it to inspect unseen tiles."},
    {feature:types.FEATURE_COLOR_NUMBERS, name:"Colored Numbers", desc:"Green numbers are surrounded by enough flagged mines; all unseen tiles around a red number must be mines."},
    {feature:types.FEATURE_DONT_COLOR_DONE, name:"Grey Numbers", desc:"Grey numbers are surrounded by visible or flagged tiles, so you don't need to worry about them."},
    {feature:types.FEATURE_CLICK_SURROUNDED, name:"Surrounded Expansion", desc:"You can click red numbers to automatically flag their unseen neighbours." },
    {feature:types.FEATURE_ERROR_DETECTION, name:"Error Detection", desc:"Tiles surrounded by too many flags will get highlighted." },
    {feature:types.FEATURE_SAFE_FIRST_CLICK, name:"Mine Mulligan", desc:"You are guaranteed not to hit a mine with your first click." },
    {feature:types.FEATURE_ZERO_FIRST_CLICK, name:"Non-zero Mulligan", desc:"You are guaranteed not to hit a zero with your first click." },
];
