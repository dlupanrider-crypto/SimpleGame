const assert=require('node:assert/strict');
const E=require('../escape-engine.js');
assert.equal(E.ROUTE.length,93);
for(let i=1;i<E.ROUTE.length;i++){
  const a=E.ROUTE[i-1],b=E.ROUTE[i];
  assert.notEqual(E.cell(...b),'#');
  assert(a[0]===b[0]?Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])===1:b[0]===a[0]+1&&E.cell(...a)==='T'&&b[1]===6&&b[2]===a[2]);
}
for(let floor=0;floor<3;floor++)assert(E.ROUTE.some(pos=>pos[0]===floor&&E.cell(...pos)==='C'));
let g=E.create([{id:'a',name:'A'}],()=>0.5),p=g.players[0];
assert(E.act(g,'a',{type:'roll',sequence:0},()=>0.99));assert.equal(g.steps,6);
assert.equal(E.act(g,'a',{type:'move',to:[0,6,1],sequence:g.sequence}),false);
assert.equal(E.act(g,'a',{type:'stop',sequence:g.sequence}),false);
for(let i=0;i<6;i++){const a=E.botMove(g);assert(E.act(g,'a',a,()=>0.5))}
assert.deepEqual([p.floor,p.row,p.col],E.ROUTE[6]);assert.notEqual(g.phase,'move');
let finished=0;for(let run=0;run<100;run++){
 g=E.create([{id:'a',name:'A'}]);
 for(let n=0;n<3000&&g.phase!=='finished';n++){const action=E.botMove(g);assert(action);assert(E.act(g,g.players[g.turn].id,action))}
 assert.equal(g.phase,'finished');assert(g.round<=40);finished++;
}
console.log('PASS fixed directed route, full dice, illegal moves, transitions and '+finished+' games');
