import test from 'node:test';
import assert from 'node:assert/strict';
import { services, residents, ledger, searchServices, balanceFor, formatTime, safeReturnPath, filterUrl } from '../src/data.mjs';

test('搜索与分类、类型、标签组合生效，不改变原数据', () => {
  const before = JSON.stringify(services);
  assert.equal(services.length, 12);
  assert.equal(searchServices('offer', {q:'手机',cat:'digital'}).length, 2);
  assert.equal(searchServices('inquiry', {cat:'garden',tag:'课程演示'}).length, 2);
  assert.equal(searchServices('offer', {q:'不存在的服务'}).length, 0);
  assert.equal(JSON.stringify(services), before);
});
test('账本按实际分钟计算，双方记录平衡，显示负数', () => {
  assert.equal(ledger.length, 3);
  assert.equal(balanceFor('student'), 30);
  assert.equal(balanceFor('resident'), -15);
  assert.equal(balanceFor('garden'), -15);
  assert.equal(residents.reduce((sum,r)=>sum+balanceFor(r.id),0), 0);
  assert.equal(formatTime(-15), '−0 小时 15 分钟');
  assert.equal(formatTime(60), '1 小时 0 分钟');
});
test('演示返回链接只允许站内地址，过滤器保留搜索并重置页码', () => {
  assert.equal(safeReturnPath('https://example.com'), '/members/student');
  assert.equal(safeReturnPath('//example.com'), '/members/student');
  assert.equal(safeReturnPath('/\\example.com'), '/members/student');
  assert.equal(safeReturnPath('/offers/digital-help'), '/offers/digital-help');
  const url = new URL(filterUrl('offer', {q:'手机',cat:'digital',page:'2'}, {cat:'craft'}), 'https://demo.example');
  assert.equal(url.searchParams.get('q'), '手机');
  assert.equal(url.searchParams.get('cat'), 'craft');
  assert.equal(url.searchParams.has('page'), false);
});
