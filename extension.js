let creating;
async function ensureHub(){
 const url=chrome.runtime.getURL('hub.html');
 if((await chrome.runtime.getContexts({contextTypes:['OFFSCREEN_DOCUMENT'],documentUrls:[url]})).length)return;
 if(!creating)creating=chrome.offscreen.createDocument({url:'hub.html',reasons:['WEB_RTC'],justification:'维护用户加入的局域网大厅连接'}).finally(()=>{creating=null});
 await creating;
}
chrome.action.onClicked.addListener(async()=>{await ensureHub();chrome.tabs.create({url:chrome.runtime.getURL('index.html')})});
chrome.runtime.onStartup.addListener(()=>ensureHub());
chrome.runtime.onMessage.addListener((m,s,reply)=>{if(m?.target!=='worker')return;if(m.type==='ensure'){ensureHub().then(()=>reply({ok:true})).catch(e=>reply({error:e.message}));return true}if(m.type==='identity-get'){chrome.storage.local.get('identity').then(data=>reply({identity:data.identity})).catch(e=>reply({error:e.message}));return true}if(m.type==='identity-set'){chrome.storage.local.set({identity:m.identity}).then(()=>reply({ok:true})).catch(e=>reply({error:e.message}));return true}if(m.type==='invite-notice'){chrome.runtime.getContexts({contextTypes:['TAB'],documentUrls:[chrome.runtime.getURL('index.html')]}).then(contexts=>{if(!contexts.length)chrome.notifications.create('invite-'+m.round,{type:'basic',iconUrl:'icon.png',title:'收到游戏邀请',message:(m.name||'搭子')+' 邀请你加入游戏，点击查看。'});reply({ok:true})}).catch(e=>reply({error:e.message}));return true}});
chrome.notifications.onClicked.addListener(async id=>{if(!id.startsWith('invite-'))return;await ensureHub();await chrome.tabs.create({url:chrome.runtime.getURL('index.html')});chrome.notifications.clear(id)});
