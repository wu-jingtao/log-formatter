import expect = require('expect.js');
import chalk from 'chalk';

import * as node_console from 'console';
import * as stream from 'stream';

const dup = new stream.Duplex({ decodeStrings: true });
const cons = new node_console.Console(dup);
dup.on('data', (data) => {
    debugger
    console.log('s', data);
});

setInterval(() => {
    cons.log(new Buffer('asd'), [123]);
}, 2000);
describe('测试模块', function () {

    before(function () {
        // 所有测试开始之前执行
    });

    after(function () {
        // 所有测试结束之后执行
    });

    beforeEach(function () {
        // 每个测试开始之前执行
    });

    afterEach(function () {
        // 每个测试结束之后执行
    });

    it('测试单元', function () {
        expect('something').to.be.a('string');
    });
});