import * as types from "../types";
import * as Require from '../meta/Require';

const allStory = [
    MakeLine('hello',
    'Congratulations on completing your basic training. You will now be granted access to your console from where you will undertake real, live, on-the-field ground weaponry defusal and disposal. Your squad awaits your orders.'
    ),
    MakeLine('first-play',"Show us what you've got", Require.OnScreen(types.SCREEN_PLAY_MINES)), 
    
]

function MakeLine(id, text, requirement) {
    return { id, text, requirement };
}

export default allStory;