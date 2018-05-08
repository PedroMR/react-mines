import * as types from '../types';
import dotProp from 'dot-prop-immutable';
import realStory from '../conf/StoryDatabase';

let story = realStory;

function useStoryDatabase(storyDB) {
    story = storyDB;
}

function getLineById(lineId) {
    return story.find(e => e.id === lineId);
}

function getLine(meta) {
    return story[0].text;
}

function trigger(meta, {type, payload}, oldState) {
    switch(type) {
        case types.CHANGE_SCREEN:
            return enqueueLine(meta, 'change')
        case '@@INIT':
            return enqueueLine(meta, 'hello')

        default:
            return meta;
    }
}

function setFlag(meta, flagName, value = true) {
    return dotProp.set(meta, 'story.flags.'+flagName, value);
}

function getFlag(meta, flagName) {
    return dotProp.get(meta, 'story.flags.'+flagName);
}

function enqueueLine(meta, lineId) {
    const line = getLineById(lineId);

    if (!line) {
        console.error("Can't find a line for id "+lineId);
        return meta;
    }

    let newMeta = dotProp.merge(meta, 'story.queue', line.text);
    newMeta = dotProp.merge(newMeta, 'story.read', lineId);

    return newMeta;
}

const Story = {
    useStoryDatabase,
    getLineById,    
    getLine,    
    enqueueLine,
    setFlag,
    getFlag,
    trigger,
}

export default Story;