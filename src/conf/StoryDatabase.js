import * as types from "../types";
import * as Require from '../meta/Require';

const allStory = [
    MakeLine('welcome',
    'Congratulations on completing your basic training. You will now be granted access to your console from where you will undertake real, live, on-the-field ground weaponry defusal and disposal. Your squad awaits your orders.'
    ),
    MakeLine('first-play',"Show us what you've got, rookie.", Require.OnScreen(types.SCREEN_PLAY_MINES)), 
    MakeReference('first-results',"As you complete missions you'll get Credits you can use to upgrade your monitoring station and your squad's equipment."), 
    MakeLine('shop-available',"I'll now unlock the Shop functionality so you can invest on upgrades.", [Require.OnScreen(types.SCREEN_MAIN), Require.HasFeature(types.FEATURE_SHOW_SHOP)]), 
]

function MakeLine(id, text, requirement) {
    return { id, text, requirement };
}

function MakeReference(id, text) {
    const requirement = Require.Never();
    return { id, text, requirement };
}

export default allStory;