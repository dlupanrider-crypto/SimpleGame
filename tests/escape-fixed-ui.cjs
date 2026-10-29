const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const os=require('node:os');const path=require('node:path');
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'escape-fixed-')),root=path.resolve(__dirname,'..');let ctx;
 try{
  ctx=await chromium.launchPersistentContext(dir,{channel:'chromium',headless:true,viewport:{width:1600,height:900},args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]});
  let worker=ctx.serviceWorkers()[0]||await ctx.waitForEvent('serviceworker');const id=new URL(worker.url()).host;
  const lobby=await ctx.newPage();await lobby.goto(`chrome-extension://${id}/index.html`);
  const [page]=await Promise.all([ctx.waitForEvent('page'),lobby.locator('[data-game="escape"]').click()]);
  const errors=[];page.on('pageerror',e=>errors.push(e.stack));
  await page.waitForLoadState('domcontentloaded');await page.locator('#nickname, #confirm-room').first().waitFor();
  if(await page.locator('#nickname').count()){await page.locator('#nickname').fill('测试玩家');await page.locator('#continue').click()}
  await page.locator('#confirm-room').click();assert(await page.locator('#escape-screen').isVisible());
  await lobby.close();await page.locator('#escape-start').click();
  const bounds=await page.locator('.escape-scene').boundingBox();assert(bounds.width>=1550&&bounds.height>=750,JSON.stringify(bounds));
  await page.locator('#escape-roll').click();await page.locator('.escape-die.rolling').waitFor();
  const rolled=await page.evaluate(()=>({die:state.escape.die,steps:state.escape.steps,pos:[state.escape.players[0].floor,state.escape.players[0].row,state.escape.players[0].col]}));
  assert.equal(rolled.steps,rolled.die);assert.deepEqual(rolled.pos,[0,6,0]);
  await page.waitForFunction(()=>state.escape.players[0].row!==6,{timeout:10000});
  assert.equal(await page.locator('#escape-confirm').count(),0);
  await page.waitForTimeout(300);if(process.env.ESCAPE_SCREENSHOT_PATH)await page.screenshot({path:process.env.ESCAPE_SCREENSHOT_PATH});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.querySelector('#escape-screen').scrollWidth>innerWidth+1),false);
  const inviteLobby=await ctx.newPage();await inviteLobby.goto(`chrome-extension://${id}/index.html`);await inviteLobby.waitForFunction(()=>typeof OfficeEscape!=='undefined'&&typeof acceptOnline==='function');
  let inviteDialog=false;ctx.on('dialog',async d=>{inviteDialog=d.message().includes('邀请你一起玩准点撤离');await d.dismiss()});
  const [invitePage]=await Promise.all([ctx.waitForEvent('page'),inviteLobby.evaluate(()=>acceptOnline({game:'escape',version:OfficeEscape.VERSION,name:'测试邀请',from:'fake-peer',round:'fake-round'}))]);
  await invitePage.waitForLoadState('domcontentloaded');await invitePage.waitForFunction(()=>location.search==='');await invitePage.waitForTimeout(700);assert(inviteDialog,'邀请应在独立游戏标签页确认');
  assert.deepEqual(errors,[]);console.log('PASS independent extension tabs for creation and invitation, full-size map, animated die and automatic movement');
 }finally{if(ctx)await ctx.close();if(path.dirname(dir)===path.resolve(os.tmpdir())&&path.basename(dir).startsWith('escape-fixed-'))fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
