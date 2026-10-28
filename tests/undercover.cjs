const assert=require('node:assert/strict');
const U=require('../undercover-engine.js');
const players=['a','b','c','d','e'].map(id=>({id,name:id}));
assert.ok(U.pairs.length>=100,'题库至少 100 组');
assert.ok(U.pairs.every(p=>p.length===2&&p[0]&&p[1]&&p[0]!==p[1]));
assert.throws(()=>U.create(players.slice(0,3),0,0),/4/);
function describe(g){for(const id of [...g.alive])assert.equal(U.act(g,id,{type:'uc-describe',text:'描述'}),true)}
const g=U.create(players,0,1);assert.equal(U.act(g,'b',{type:'uc-describe',text:'抢答'}),false);assert.equal(U.act(g,'a',{type:'uc-vote',target:'b'}),false);
const civilian=U.project(g,'a'),spy=U.project(g,'b');assert.equal(civilian.ownWord,U.pairs[0][0]);assert.equal(spy.ownWord,U.pairs[0][1]);assert.equal(civilian.spy,undefined);assert.equal(civilian.spyWord,undefined);assert.equal(civilian.civilianWord,undefined);assert.equal(civilian.reveal,undefined);
describe(g);assert.equal(g.phase,'vote');assert.equal(U.act(g,'a',{type:'uc-vote',target:'a'}),false);assert.equal(U.act(g,'a',{type:'uc-vote',target:'b'}),true);assert.equal(U.act(g,'a',{type:'uc-vote',target:'c'}),false);assert.equal(U.project(g,'c').votes,undefined);for(const id of ['c','d','e'])assert.equal(U.act(g,id,{type:'uc-vote',target:'b'}),true);assert.equal(U.act(g,'b',{type:'uc-vote',target:'a'}),true);assert.equal(g.result.winner,'civilian');assert.equal(U.project(g,'a').reveal.spy,'b');
const tie=U.create(players.slice(0,4),1,0);describe(tie);for(const [id,target] of [['a','b'],['b','a'],['c','b'],['d','a']])U.act(tie,id,{type:'uc-vote',target});assert.equal(tie.phase,'describe');assert.equal(tie.result.tie,true);assert.equal(tie.alive.length,4);assert.equal(tie.round,2);
const spyWin=U.create(players.slice(0,4),2,0);describe(spyWin);for(const [id,target] of [['a','b'],['b','c'],['c','b'],['d','b']])U.act(spyWin,id,{type:'uc-vote',target});assert.equal(spyWin.phase,'describe');describe(spyWin);for(const [id,target] of [['a','c'],['c','d'],['d','c']])U.act(spyWin,id,{type:'uc-vote',target});assert.equal(spyWin.result.winner,'spy');
console.log('PASS undercover word pool, privacy, turn order, validation, ties and both outcomes');
