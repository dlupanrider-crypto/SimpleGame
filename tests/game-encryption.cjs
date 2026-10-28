const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const text=fs.readFileSync('lobby.js','utf8');
const code=text.slice(text.indexOf('async function makeKeys()'),text.indexOf('async function inviteOnline('));
const delivered=[], packets=[];
const context=vm.createContext({crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,Promise,Map,console,hub:async(_type,message)=>{packets.push(message);if(message.to==='b')b.receive(message.data);else a.receive(message.data)}});
vm.runInContext('const routedChannels=new Map();'+code,context);
const run=code=>vm.runInContext(code,context);
let a,b;
async function main(){
 const keyA=await run('makeKeys()'),keyB=await run('makeKeys()');
 const pubA=await webcrypto.subtle.exportKey('jwk',keyA.publicKey),pubB=await webcrypto.subtle.exportKey('jwk',keyB.publicKey);
 context.privateA=keyA.privateKey;context.privateB=keyB.privateKey;context.pubA=pubA;context.pubB=pubB;
 const sharedA=await run('sharedKey(privateA,pubB)'),sharedB=await run('sharedKey(privateB,pubA)');
 a=run("routedChannel('b','session')");b=run("routedChannel('a','session')");
 b.onmessage=e=>delivered.push(e.data);a.open(sharedA);b.open(sharedB);
 a.send('秘密汤底');a.send('第二条消息');
 for(let i=0;i<100&&delivered.length<2;i++)await new Promise(resolve=>setTimeout(resolve,10));
 assert.deepEqual(delivered,['秘密汤底','第二条消息']);
 assert.equal(JSON.stringify(packets).includes('秘密汤底'),false,'relayed packet must not contain plaintext');
 assert.ok(packets[0].data.iv.length===12&&packets[0].data.ciphertext.length>0);
 console.log('game encryption: passed');
}
main().catch(e=>{console.error(e);process.exitCode=1});
