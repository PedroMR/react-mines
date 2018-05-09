import {OwnsItem, Not, Validate, OnScreen} from './Require';

test('owns item', ()=>{
    const itemId = 'item1';
    const meta = {items: [itemId]}

    expect(OwnsItem(itemId)(meta)).toBeTruthy();
    expect(OwnsItem('foobar')(meta)).toBeFalsy();
}) ;

test('negating tests', ()=>{
    const itemId = 'item1';
    const meta = {items: [itemId]}

    expect(OwnsItem(itemId)(meta)).toBeTruthy();
    expect(Not(OwnsItem(itemId))(meta)).toBeFalsy();
})

test('validate runs and is default accept', () => {
    const itemId = 'item1';
    const meta = {items: [itemId]}
    const req = undefined;
    const req2 = OwnsItem(itemId);
    const reqs = [undefined, OwnsItem(itemId)];
    const reqs2 = [OwnsItem(itemId)];
    const req3 = [OwnsItem('non-item')];
    const reqs3 = [req, req2, req3];

    expect(Validate(req, meta)).toBeTruthy();
    expect(Validate(req2, meta)).toBeTruthy();
    expect(Validate(reqs, meta)).toBeTruthy();
    expect(Validate(reqs2, meta)).toBeTruthy();
    expect(Validate(reqs3, meta)).toBeFalsy();
})

test('on screen', ()=>{
    const screenId = 'screen1';
    const meta = { current: {screen: screenId}}

    expect(Validate(OnScreen(screenId), meta)).toBeTruthy();
    expect(Validate(OnScreen('foobar'), meta)).toBeFalsy();
}) ;