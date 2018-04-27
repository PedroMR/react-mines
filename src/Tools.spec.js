import * as tools from './Tools';

test('get credits', () => {
    expect(tools.getCredits({wallet: {credits: 100}})).toBe(100);
});