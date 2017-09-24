import log from '../src/index';

log.lineWithText('不带连缀');

//测试数据
const args = [0, 1.1, 'string', true, false, null, undefined, { a: 123 }, [456], Buffer.alloc(10).fill(1)];
log(...args);
log.warn(...args);
log.error(...args);

log.lineWithText('连缀用法');

const format = log.noTime.location.round.mustache.title.bold.magenta.content.yellow;
format('test','test Error', new Error('test'));