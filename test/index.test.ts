import * as moment from 'moment';
import * as util from 'util';
import chalk from 'chalk';
import expect = require('expect.js');

import log from '../src';

it('测试 输出到控制台', function () {
    log.blue.line(); // 蓝色分割线
    log.bgYellow.whiteBright.bold('用肉眼检测一下。下面输出的样式是否符合要求');

    log('普通样式');
    log.location.text.cyan.bold('log', '蓝色粗体');
    log.log.location.text.yellow('log', '黄色未加粗');
    log.warn.location.text.magenta.bgCyan.bold('warn', '紫色粗体背景蓝色');
    log.error.location.text.green.underline('error', '绿色带下划线');
    log.blue.line();
});

describe('测试 format参数个数', function () {
    it('测试 参数个数 等于 样式层数', function () {
        expect(log.noDatetime.text.red.text.yellow.text.blue.format(1, 2, 3)).to.be(
            [chalk.red('1'), chalk.yellow('2'), chalk.blue('3')].join(' ')
        );
    });

    it('测试 参数个数 大于 样式层数', function () {
        expect(log.noDatetime.text.red.text.yellow.text.blue.format(1, 2, 3, 4)).to.be(
            [chalk.red('1'), chalk.yellow('2'), chalk.blue('3'), chalk.blue('4')].join(' ')
        );
    });

    it('测试 参数个数 小于 样式层数', function () {
        expect(log.noDatetime.text.red.text.yellow.text.white.format(1, 2)).to.be(
            [chalk.red('1'), chalk.yellow('2')].join(' ')
        );
    });
});

describe('测试 json缩进', function () {
    const obj = { a: 1, b: 2 };

    it('测试不使用缩进', function () {
        expect(log.noDatetime.format(obj)).to.be(util.formatWithOptions({ compact: true }, obj as any));
    });

    it('测试使用缩进', function () {
        expect(log.noDatetime.indentJson.format(obj)).to.be(util.formatWithOptions({ compact: false }, obj as any));
    });
});

describe('测试 时间显示', function () {
    it('测试显示日期时间', function () {
        expect(log.blue.format('1')).to.be(
            [chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.blue('1')].join(' ')
        );
    });

    it('测试只显示日期', function () {
        expect(log.noTime.blue.format('2')).to.be(
            [chalk.gray(`[${moment().format('YYYY-MM-DD')}]`), chalk.blue('2')].join(' ')
        );
    });

    it('测试只显示时间', function () {
        expect(log.blue.noDate.format('3')).to.be(
            [chalk.gray(`[${moment().format('HH:mm:ss')}]`), chalk.blue('3')].join(' ')
        );
    });

    it('测试不显示日期时间', function () {
        expect(log.noDatetime.blue.format('4')).to.be([chalk.blue('4')].join(' '));

        expect(log.noDate.noTime.blue.format('5')).to.be([chalk.blue('5')].join(' '));
    });
});

describe('测试 样式层', function () {
    it('测试text', function () {
        expect(log.red.bold.format(1)).to.be(
            [chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.red.bold('1')].join(' ')
        );

        expect(log.text.red.bold.format(1)).to.be(log.red.bold.format(1));
    });

    it('测试多个样式层', function () {
        expect(log.text.red.bold.text.blue.bgGreenBright.text.yellow.underline.format(1, 2, 3)).to.be(
            [
                chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`),
                chalk.red.bold('1'),
                chalk.blue.bgGreenBright('2'),
                chalk.yellow.underline('3')
            ].join(' ')
        );

        expect(log.red.bold.text.blue.bgGreenBright.text.yellow.underline.format(1, 2, 3)).to.be(
            log.text.red.bold.text.blue.bgGreenBright.text.yellow.underline.format(1, 2, 3)
        );
    });

    it('测试title', function () {
        expect(log.title.red.bold.format(1)).to.be(log.text.red.bold.format(1));
        expect(log.title.red.bold.title.red.bold.format(1, 2)).to.be(log.text.red.bold.text.red.bold.format(1, 2));
    });

    it('测试linefeed', function () {
        expect(log.linefeed.red.bold.format(1)).to.be(
            [chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), '\r\n', chalk.red.bold('1')].join(' ')
        );

        expect(log.linefeed.red.bold.format(1)).to.be(log.linefeed.text.red.bold.format(1));
    });

    it('测试whitespace', function () {
        expect(log.whitespace.red.bold.format(1)).to.be(
            [chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), ' ', chalk.red.bold('1')].join(' ')
        );

        expect(log.whitespace.red.bold.format(1)).to.be(log.whitespace.text.red.bold.format(1));
    });

    it('测试content', function () {
        expect(log.content.red.bold.format(1)).to.be(log.linefeed.text.red.bold.format(1));
    });

    it('测试location', function () {
        expect(log.location.red.bold.format(1)).to.be(log.text.square.red.bold.format(1));
    });
});

it('测试 样式模板', function () {
    expect(log.square.round.mustache.red.format(1)).to.be(
        [chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.red('{([1])}')].join(' ')
    );

    expect(log.text.square.round.mustache.red.format(1)).to.be(log.square.round.mustache.red.format(1));
});

it('测试 chalk的方法', function () {
    const actual = log.noDatetime
        .rgb(1, 2, 3).hsl(1, 2, 3).hsv(1, 2, 3).hwb(1, 2, 3).hex('#DEADED').keyword('orange')
        .bgRgb(1, 2, 3).bgHsl(1, 2, 3).bgHsv(1, 2, 3).bgHwb(1, 2, 3).bgHex('#DEADED').bgKeyword('orange')
        .format(1);

    const expected = chalk
        .rgb(1, 2, 3).hsl(1, 2, 3).hsv(1, 2, 3).hwb(1, 2, 3).hex('#DEADED').keyword('orange')
        .bgRgb(1, 2, 3).bgHsl(1, 2, 3).bgHsv(1, 2, 3).bgHwb(1, 2, 3).bgHex('#DEADED').bgKeyword('orange')('1');

    expect(actual).to.be(expected);
});