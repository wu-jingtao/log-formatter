import moment from 'moment';
import expect from 'expect.js';
import chalk, { Chalk } from 'chalk';
import log from '../src';

it('测试 输出到控制台', function () {
    log.title('用肉眼检测一下，下面输出的样式是否符合要求');
    log.line().blue.text.blue('蓝色分割线');
    log.bgYellow.rgb(255, 0, 0).bold('黄色背景，红色，粗体');
    log('普通样式');
    log.location.text.cyan.bold('方括号', '蓝青色粗体');
    log.warn.text.magenta.bold.bgCyan('警告，洋红色，粗体，背景蓝色');
    log.error.dateTime.text.date.reset.time.yellow('方括号黄色时间，白色日期，灰色方括号日期时间');
    log.info.bgGreen.indentJson({ 123: 123, 456: 456 }, 'JSON 缩进');
    const style = log.cyan;
    style('重复打印一');
    style('重复打印二');
});

describe('测试 日期时间显示', function () {
    it('测试 显示时间', function () {
        expect(log.time.blue.format()).eql([chalk.gray.blue(`[${moment().format('HH:mm:ss')}]`)]);
    });

    it('测试 显示日期', function () {
        expect(log.date.reset.format()).eql([moment().format('YYYY-MM-DD')]);
    });

    it('测试 显示日期时间', function () {
        expect(log.dateTime.format()).eql([chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`)]);
    });
});

it('测试 设置输出格式', function () {
    expect(
        log
            .text.square.round.mustache.indentJson
            .text.square.round.mustache.indentJson.reset
            .format({ abc: 123 }, { def: 456 })
    ).eql([`{([${JSON.stringify({ abc: 123 }, undefined, 2)}])}`, JSON.stringify({ def: 456 })]);
});

it('测试 插入符号', function () {
    expect(log.linebreak.newline.whitespace.colon.hyphen.verticalBar.line().format(1)).eql([
        '\r\n1\r\n    :  -  | ', `\r\n${'-'.repeat(80)}\r\n`
    ]);
});

it('测试 占位符', function () {
    expect(log.text.location.title.paragraph.section.format(1, 2, 3, 4, 5)).eql([
        1, '[2]', chalk.bold('3\r\n'), '4\r\n', '\r\n5\r\n'
    ]);
});

it('测试 chalk 功能', function () {
    expect(
        log
            .level1.level2.level3.level4
            .bold.red.bgRed
            .rgb(0, 1, 2).bgRgb(0, 1, 2)
            .hex('#FFF').bgHex('#FFF')
            .ansi256(0).bgAnsi256(0)
            .format(1)
    ).eql([
        new Chalk({ level: 3 })
            .bold.red.bgRed
            .rgb(0, 1, 2).bgRgb(0, 1, 2)
            .hex('#FFF').bgHex('#FFF')
            .ansi256(0).bgAnsi256(0)(1)
    ]);
});

describe('测试 传入参数个数', function () {
    it('测试 参数个数 等于 样式层数', function () {
        expect(log.text.red.text.yellow.text.blue.format(1, 2, 3)).eql(
            [chalk.red('1'), chalk.yellow('2'), chalk.blue('3')]
        );
    });

    it('测试 参数个数 大于 样式层数', function () {
        expect(log.text.red.text.yellow.text.blue.format(1, undefined, 2, 3, null, undefined, false)).eql(
            [chalk.red('1'), chalk.blue('2'), 3, null, false]
        );
    });

    it('测试 参数个数 小于 样式层数', function () {
        expect(log.text.red.text.yellow.text.blue.line('line', 1).reset.format(1, 2)).eql(
            [chalk.red('1'), chalk.yellow('2'), 'line']
        );
    });
});

it('测试 多次格式化', function () {
    const style = log.text.red.text.yellow.text.blue;

    expect(style.format(1, 2, 3)).eql(
        [chalk.red('1'), chalk.yellow('2'), chalk.blue('3')]
    );

    expect(style.format(1, 2, 3)).eql(
        [chalk.red('1'), chalk.yellow('2'), chalk.blue('3')]
    );
});
