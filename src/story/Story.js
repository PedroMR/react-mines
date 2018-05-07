import * as types from '../types';

import realStory from '../conf/StoryDatabase';


function getLine(meta) {
    return realStory[0].text;
}

const Story = {
    getLine,    
}

export default Story;