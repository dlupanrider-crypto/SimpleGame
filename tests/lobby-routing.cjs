const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const source = fs.readFileSync('hub.js', 'utf8');
function node(id) {
 const notifications=[];
 const chrome={runtime:{sendMessage:m=>{notifications.push(m);if(m.target==='worker'&&m.type==='identity-get')return Promise.resolve({identity:{id,name:id}});if(m.target==='worker'&&m.type==='identity-set')return Promise.resolve({ok:true});return Promise.resolve()},onMessage:{addListener(){}}}};
 class FakePeer { constructor(){this.iceGatheringState='complete'} createDataChannel(){return {readyState:'connecting'}} async createOffer(){return {type:'offer',sdp:'test'}} async setLocalDescription(value){this.localDescription=value} }
 const timeout=(fn,ms)=>{const timer=setTimeout(fn,ms);timer.unref();return timer};
 const ctx=vm.createContext({chrome,crypto:{randomUUID},console,Date,Map,Set,Promise,setInterval:()=>{},setTimeout:timeout,clearTimeout,btoa,atob,encodeURIComponent,decodeURIComponent,escape,unescape,RTCPeerConnection:FakePeer});
 vm.runInContext(source,ctx);
 return {ctx,notifications,run:code=>vm.runInContext(code,ctx)};
}
async function main(){
 const a=node('a'),b=node('b'),c=node('c');
 await Promise.all([a.run('ready'),b.run('ready'),c.run('ready')]);
 assert.equal(a.run('me.id'),'a','offscreen initialization uses the worker identity bridge');
 const offer=await a.run("command({type:'offer'})");
 a.ctx.inviteCode=offer.code;
 assert.equal(a.run('decode(inviteCode).kind'),'lobby-offer','initialized hub can generate an invitation');
 await a.run("command({type:'name',name:'新昵称'})");
 assert.ok(a.notifications.some(x=>x.type==='identity-set'&&x.identity.name==='新昵称'),'nickname persists through the worker');
 function link(x,y){const peer={dc:{readyState:'open',send:s=>{y.ctx.packet=JSON.parse(s);y.ctx.via=x.run('me.id');y.run('receive(packet,via)')}}};x.ctx.peer=peer;x.run(`peers.set(${JSON.stringify(y.run('me.id'))},peer)`)}
 link(a,b);link(b,a);link(b,c);link(c,b);
 a.run("send('presence',me)");b.run("send('presence',me)");c.run("send('presence',me)");
 assert.equal(a.run("members.has('c')"),true,'presence should cross an intermediate peer');
 a.run("send('game-invite',{round:'r1',game:'draw'},'c')");
 assert.equal(c.notifications.filter(x=>x.type==='game-invite').length,1,'target receives relayed invitation');
 assert.equal(b.notifications.filter(x=>x.type==='game-invite').length,0,'intermediate peer does not deliver targeted invitation');
 assert.equal(c.notifications.filter(x=>x.type==='invite-notice').length,1,'background requests an invitation notification');
 const claimed=await c.run("command({type:'claim-invite',round:'r1'})");
 assert.equal(claimed.from,'a','the invitation remains available until claimed');
 assert.equal(await c.run("command({type:'claim-invite',round:'r1'})"),null,'an invitation can only be claimed once');
 a.run("send('room',{id:'room1',owner:'a',name:'测试',game:'draw',count:2,playerIds:['a','b'],updated:Date.now()})");
 assert.equal(c.run("rooms.has('room1')"),true,'room advertisement is relayed');
 assert.deepEqual(Array.from(c.run("rooms.get('room1').playerIds")),['a','b'],'room player membership is relayed');
 a.run("send('destroy',{id:'room1'})");
 assert.equal(c.run("rooms.has('room1')"),false,'room destruction is relayed');
 const packet={id:'duplicate',from:'a',to:'c',type:'game-data',data:{session:'r1',value:'hello'},ttl:12};
 c.ctx.packet=packet;c.run("receive(packet,'b');receive(packet,'b')");
 assert.equal(c.notifications.filter(x=>x.type==='game-data').length,1,'duplicate packets are delivered once');
 console.log('lobby routing: passed');
}
main().catch(e=>{console.error(e);process.exitCode=1});
