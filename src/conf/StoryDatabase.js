import * as types from "../types";
import * as Require from '../meta/Require';

const allStory = [
    MakeSingleLine('hello', 
    'Congratulations on completing your basic training. You will now be granted access to your console from where you will undertake real, live, on-the-field ground weaponry defusal and disposal. Your squad awaits your orders.'
),
    MakeSingleLine('change','Changed Screen'), 
    
]

function MakeSingleLine(id, text) {
    return { id, text };
}

export default allStory;