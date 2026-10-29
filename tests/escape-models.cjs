const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1200,height:800}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',msg=>{if(msg.type()==='warning')console.log('browser warning:',msg.text())});
    await page.addInitScript(()=>{
      localStorage.name='房主';
      const snapshot={me:{id:'host',name:'房主'},members:[{id:'host',name:'房主'}],rooms:[],invitations:[]};
      window.chrome={runtime:{sendMessage:async m=>m.target==='worker'?{ok:true}:{data:m.type==='get'?snapshot:{}},onMessage:{addListener(){}}}};
    });
    await page.goto('http://127.0.0.1:8769/?escape=create');
    await page.locator('#confirm-room').click();
    await page.locator('#escape-start').click();
    await page.waitForFunction(()=>Escape3D.modelStatus().loaded);
    const first=await page.evaluate(()=>Escape3D.modelStatus());
    assert(first.anchors>0);assert.equal(first.attached,first.anchors);assert.equal(first.failed,false);
    await page.locator('#escape-roll').click();
    const second=await page.evaluate(()=>Escape3D.modelStatus());
    assert(second.anchors>0);assert.equal(second.attached,second.anchors);
    assert.deepEqual(errors,[]);
    console.log('PASS workstation model loads and remains attached across scene redraws');
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
