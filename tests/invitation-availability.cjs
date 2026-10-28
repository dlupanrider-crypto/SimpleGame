const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lobby.js','utf8');
const availability=source.slice(source.indexOf('function availableLobbyMembers('),source.indexOf('function renderLobby('));
const accept=source.slice(source.indexOf('async function acceptOnline('),source.indexOf('chrome.runtime.onMessage.addListener',source.indexOf('async function acceptOnline(')));
const sent=[];let confirmations=0;
const ctx=vm.createContext({state:null,confirm:()=>{confirmations++;return false},hub:async(type,data)=>sent.push({type,...data}),console});
vm.runInContext(availability+'\n'+accept,ctx);
async function main(){
 ctx.snapshot={me:{id:'self'},members:[{id:'self'},{id:'free'},{id:'owner'},{id:'guest'},{id:'current'}],rooms:[{owner:'owner',playerIds:['owner','guest']}]};ctx.room={players:[{id:'self'},{id:'current'}]};
 assert.deepEqual(Array.from(vm.runInContext('availableLobbyMembers(snapshot,room).map(p=>p.id)',ctx)),['free']);
 ctx.snapshot.rooms=[];assert.deepEqual(Array.from(vm.runInContext('availableLobbyMembers(snapshot,room).map(p=>p.id)',ctx)),['free','owner','guest']);
 ctx.state={players:[]};await vm.runInContext("acceptOnline({from:'sender',round:'r',name:'发送人',game:'draw'})",ctx);assert.equal(confirmations,0);assert.equal(sent[0].data.reason,'busy');
 ctx.state=null;await vm.runInContext("acceptOnline({from:'sender',round:'r2',name:'发送人',game:'draw'})",ctx);assert.equal(confirmations,1);assert.equal(sent[1].data.reason,'declined');
 console.log('PASS lobby-only filtering and explicit busy versus declined responses');
}
main().catch(e=>{console.error(e);process.exitCode=1});
