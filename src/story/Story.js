import * as types from '../types';
import dotProp from 'dot-prop-immutable';
import realStory from '../conf/StoryDatabase';
import * as Require from '../meta/Require';

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
        case types.NEW_GAME:
            return enqueueNextAvailableLine(meta);

        default:
            return meta;
    }
}

function enqueueNextAvailableLine(meta) {
    for (let line of story) {
        if (meta.story.read[line.id]) continue;

        if (!Require.Validate(line.requirement, meta))
            continue;
        
        return enqueueLine(meta, line.id);
    }

    return meta;
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

    const maxQueue = 10;
    const queueLen = meta.story.queue.length;
    if (queueLen > maxQueue) {
        newMeta.story.queue = newMeta.story.queue.slice(queueLen - maxQueue);
    }

    newMeta = dotProp.set(newMeta, 'story.read.'+lineId, true);

    return newMeta;
}

function enqueueInitialLine(meta) {
    return enqueueLine(meta, 'welcome');
}

const Story = {
    useStoryDatabase,
    getLineById,    
    getLine,    
    enqueueLine,
    setFlag,
    getFlag,
    trigger,
    enqueueInitialLine,
}

export default Story;