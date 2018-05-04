import {OwnsItem, Not} from './Require';

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