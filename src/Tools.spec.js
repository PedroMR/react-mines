import * as types from './types';
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
    const base = 2;
    const baseWallet = {wallet: {credits: base}};
    const baseWalletPlusAmount = {wallet: {credits: base + amount}};

    expect(tools.addCredits(baseWallet, amount)).toEqual(baseWalletPlusAmount);
    expect(baseWallet).not.toEqual(baseWalletPlusAmount);
})

test('scoring a mines game', () => {
    const results = {nMinesFound: 5, nMinesDetonated: 1};
    
    const score1 = undefined;
    const score2 = {};
    const score3 = {perMineFound: 5};
    expect(tools.totalScoreFor(score1, results)).toEqual(15);
    expect(tools.totalScoreFor(score2, results)).toEqual(15);
    expect(tools.totalScoreFor(score3, results)).toEqual(15);

    const score4 = {perMineFound: 10};
    expect(tools.totalScoreFor(score4, results)).toEqual(40);

})

test('scoring with multiplier', () => {
    const results = {nMinesFound: 5, nMinesDetonated: 1};
    let score = { multiplier: 2 };
    expect(tools.totalScoreFor(score, results)).toEqual(30);    
})