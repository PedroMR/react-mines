import Story from './Story';
import realLines from '../conf/StoryDatabase';

const story = [
    {id: 'testOne', text: 'Hello!' },
]

test('get story line by id', () => {
    Story.useStoryDatabase(story);

    expect(Story.getLineById('testOne')).toHaveProperty('id', 'testOne');
    expect(Story.getLineById('asdf')).toBeUndefined();
})

test('Per request place story line on queue', () => {
    Story.useStoryDatabase(story);

    let meta = { story: { queue: [], read: [] } };
    let newMeta = Story.enqueueLine(meta, 'testOne');

    expect(newMeta.story.queue).toContain('Hello!');
    expect(newMeta.story.read).toContain('testOne');
    
})

test('Set story flags', () => {
    Story.useStoryDatabase(story);

    let meta = { story: { flags: {} } };
    let newMeta = Story.setFlag(meta, 'flag-a');

    expect(newMeta.story.flags).toHaveProperty('flag-a');
    expect(newMeta.story.flags).not.toHaveProperty('non-flag');
    
})

test('Get story flags', () => {
    Story.useStoryDatabase(story);

    let meta = { story: { flags: { flagA: true } } };
    expect(Story.getFlag(meta, 'flagA')).toBeTruthy();
    expect(Story.getFlag(meta, 'flagNotSet')).toBeFalsy();

    let newMeta = Story.setFlag(meta, 'flagB');
    console.log(newMeta);
    expect(Story.getFlag(newMeta, 'flagB')).toBeTruthy();
    expect(Story.getFlag(newMeta, 'flagA')).toBeTruthy();

    newMeta = Story.setFlag(newMeta, 'flagA', false);
    expect(Story.getFlag(newMeta, 'flagB')).toBeTruthy();
    expect(Story.getFlag(newMeta, 'flagA')).toBeFalsy();
    
})