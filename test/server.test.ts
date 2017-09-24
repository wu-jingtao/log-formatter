import log from '../src/index';

log.bold.bgMagenta.line('不带连缀');

//测试数据
const args = [0, 1.1, 'string', true, false, null, undefined, { a: 123 }, [456], Buffer.alloc(10).fill(1), /* new Error('test') */];
log(...args);
log.warn(...args);
log.error(...args);

log.line();
log.bold.bgMagenta('连缀用法');
log.line();

const format = log.noTime.location.round.mustache.title.bold.magenta.content.yellow;
format('test','test Error', new Error('test'));
