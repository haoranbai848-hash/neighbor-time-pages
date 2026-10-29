// Explicit fictional classroom fixtures. No DB export, passwords or real contact details.
export const community = '和合里未来社区（课程虚构）';
export const categories = [
  { id:'digital', name:'数字生活', icon:'phone', tone:'digital', description:'手机使用、数字技能，让生活里的新事物更容易上手。', examples:'手机陪练 · 拍照分享 · 数字交流' },
  { id:'craft', name:'手作与生活', icon:'craft', tone:'craft', description:'把手中的巧思与生活经验，变成邻里之间的好礼物。', examples:'缝补手作 · 旧物新生 · 经验分享' },
  { id:'garden', name:'社区园艺', icon:'garden', tone:'garden', description:'一起照料一盆绿意，也让社区的关系慢慢生长。', examples:'植物养护 · 阳台种植 · 园艺交流' },
];
export const residents = [
  {id:'student', name:'小林 · 青年居民（虚构）', description:'愿意分享手机与电脑技能，也想向邻居学习手作和园艺。', skills:'数字生活', role:'青年居民'},
  {id:'resident', name:'陈阿姨 · 手作居民（虚构）', description:'喜欢缝补和旧物改造，也需要学习数字生活技能。可由工作人员协助登记。', skills:'手作与生活', role:'手作居民'},
  {id:'garden', name:'周叔 · 园艺居民（虚构）', description:'愿意分享阳台种植经验，也想学习照片整理和简单手作。', skills:'社区园艺', role:'园艺居民'},
  {id:'manager', name:'社区工作人员（虚构）', description:'协助居民登记、联系和时间记账。课程虚构角色，无真实联系方式。', skills:'协助登记与记账', role:'社区工作人员'},
];
const fixtureRows = [
  ['offer','student','digital','digital-help','手机基础与线上办事陪练','陪你练习字体调整、扫码和查询办事入口，约 60 分钟。不代管密码或操作资金。',60],
  ['offer','student','digital','photo-help','一起整理手机里的照片','整理相册、学习备份，约 30 分钟。仅使用课堂示例照片。',30],
  ['offer','resident','craft','handcraft-help','旧衣缝补与手作分享','一起学习钉纽扣、简单缝补，约 45 分钟。材料与工具由双方事先商量。',45],
  ['offer','resident','craft','reuse-help','旧物改造小课堂','用闲置布料制作小收纳袋，约 60 分钟。地点可线下商量。',60],
  ['offer','garden','garden','garden-help','阳台植物养护交流','识别浇水和光照需求，约 30 分钟。使用课堂盆栽示例。',30],
  ['offer','garden','garden','seedling-help','社区花圃育苗经验分享','分享播种、移栽与日常养护经验，约 60 分钟。活动地点由双方线下确认。',60],
  ['inquiry','resident','digital','digital-request','想学会手机字体调整和扫码','希望有人耐心陪我练习手机基础，预计 60 分钟。可请社区工作人员协助联系。',60],
  ['inquiry','garden','digital','photo-request','想学习手机照片备份','想用示例照片学习分类与备份，预计 30 分钟。',30],
  ['inquiry','garden','craft','handcraft-request','想学旧衣缝补','希望学会钉纽扣和简单缝补，预计 45 分钟。材料事先商量。',45],
  ['inquiry','student','craft','reuse-request','想做一个旧布收纳袋','想向有经验的邻居学习旧物改造，预计 60 分钟。',60],
  ['inquiry','student','garden','garden-request','请教阳台薄荷养护','薄荷的浇水与光照不太会判断，希望交流 30 分钟。',30],
  ['inquiry','resident','garden','seedling-request','想了解花圃育苗方法','愿意参与公共花圃，希望先学习育苗基础，预计 60 分钟。',60],
];
export const services = fixtureRows.map(([kind,residentId,categoryId,id,title,description,minutes])=>({kind,residentId,categoryId,id,title,description,minutes,tags:['课程演示'],location:'联系后约定',date:'2026-10-29'}));
export const ledger = [
  {id:'t1',from:'resident',to:'student',minutes:60,title:'手机基础陪练',date:'2026-10-26'},
  {id:'t2',from:'garden',to:'resident',minutes:45,title:'旧衣缝补分享',date:'2026-10-27'},
  {id:'t3',from:'student',to:'garden',minutes:30,title:'阳台植物交流',date:'2026-10-28'},
];
export const person = id => residents.find(r=>r.id===id);
export const category = id => categories.find(c=>c.id===id);
export const servicePath = s => `/${s.kind==='offer'?'offers':'inquiries'}/${s.id}`;
export function balanceFor(id) { return ledger.reduce((sum,t)=>sum+(t.to===id?t.minutes:0)-(t.from===id?t.minutes:0),0); }
export function formatTime(minutes) { return `${minutes<0?'−':''}${Math.floor(Math.abs(minutes)/60)} 小时 ${Math.abs(minutes)%60} 分钟`; }
export function searchServices(kind, {q='',cat='',tag=''}={}) {
  const needle=q.trim().toLocaleLowerCase();
  return services.filter(s=>s.kind===kind && (!cat||s.categoryId===cat) && (!tag||s.tags.includes(tag)) && (!needle||[s.title,s.description,person(s.residentId).name,category(s.categoryId).name].join(' ').toLocaleLowerCase().includes(needle)));
}
export function filterUrl(kind, current={}, overrides={}) {
  const params=new URLSearchParams();
  for (const [key,value] of Object.entries({...current,page:undefined,...overrides})) if (['q','cat','tag','page'].includes(key)&&value) params.set(key,value);
  return `/${kind==='offer'?'offers':'inquiries'}${params.size?'?'+params:''}#marketplace-results`;
}
export function safeReturnPath(value) { return typeof value==='string' && value.startsWith('/') && !value.startsWith('//') && !/[\\\r\n]/.test(value) ? value : '/members/student'; }
