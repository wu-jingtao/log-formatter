import log from '../src/index';
import expect = require('expect.js');

//测试数据
const args = [0, 1.1, 'string', true, false, null, undefined, { a: 123 }, [456], Buffer.alloc(10).fill(1), new Error('test')];

it('不带连缀', function () {
    log(...args);
    log.warn(...args);
    log.error(...args);
});
