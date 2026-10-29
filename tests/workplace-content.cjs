const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const pack=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/features/active/pingan-monopoly/content/workplace-humor.zh-CN.0.1.0-draft.json'),'utf8'));
assert.equal(pack.status,'draft');assert.equal(pack.schema_version,1);assert.equal(pack.locale,'zh-CN');
const ids=new Set();const allowed=new Set(['work_status','work_quotes','jargon','pua','blame','nonsense','sarcasm']);
for(const item of pack.items){assert.ok(!ids.has(item.id),'duplicate id '+item.id);ids.add(item.id);assert.ok(allowed.has(item.category));assert.ok(item.text.trim());assert.equal(typeof item.enabled_by_default,'boolean');assert.ok(['general','optional'].includes(item.audience));if(item.audience==='optional')assert.equal(item.enabled_by_default,false);if(item.category==='jargon')assert.ok(item.plain_language?.trim())}
assert.equal(ids.size,76);console.log('PASS 76 draft entries, unique IDs, default opt-out and plain-language translations');
