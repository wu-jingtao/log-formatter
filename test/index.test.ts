import log from '../src/index';

log.lineWithText('不带连缀');

//测试数据
const args = [0, 1.1, 'string', true, false, null, undefined, { a: 123 }, [456], Buffer.alloc(10).fill(1)];
log(...args);
log.warn(...args);
log.error(...args);

log.lineWithText('连缀用法');

const format = log.noTime
    .location.round.mustache
    .title.bold.green
    .content.yellow;

format('location', 'title', new Error('测试打印错误'));

log.line(undefined, 10);

log.warn.noDate
    .location
    .title.blue
    .content.red
    .text.green(`location`, 'title', `content`, 'text');