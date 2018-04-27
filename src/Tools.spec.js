import * as tools from './Tools';

test('get credits', () => {
    expect(tools.getCredits({wallet: {credits: 100}})).toBe(100);
    expect(tools.getCredits({})).toBe(0);
});

test('add credits to wallet', () => {
    const amount = 10;
    const base = 6;
    const baseWallet = {wallet: {credits: base}};
    const emptyWalletPlusAmount = {wallet: {credits: amount}};
    const baseWalletPlusAmount = {wallet: {credits: base + amount}};
    expect(tools.addCredits({}, amount)).toEqual(emptyWalletPlusAmount);
    expect(tools.addCredits({wallet: {}}, amount)).toEqual(emptyWalletPlusAmount);
    expect(tools.addCredits(baseWallet, amount)).toEqual(baseWalletPlusAmount);
})

test('adding credits does not mutate wallet', ()=> {
    const amount = 10;
    const base = 6;
    const baseWallet = {wallet: {credits: base}};
    const baseWalletPlusAmount = {wallet: {credits: base + amount}};

    expect(tools.addCredits(baseWallet, amount)).toEqual(baseWalletPlusAmount);
    expect(baseWallet).not.toEqual(baseWalletPlusAmount);
})