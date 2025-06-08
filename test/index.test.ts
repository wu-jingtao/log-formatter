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

describe('测试 设置输出格式', function () {
    it('测试 多层嵌套与 reset', function () {
        expect(
            log
                .text.square.round.mustache
                .text.square.round.mustache.reset
                .format({ abc: 123 }, { def: 456 })
        ).eql([`{([${JSON.stringify({ abc: 123 })}])}`, JSON.stringify({ def: 456 })]);
    });

    it('测试 空对象', function () {
        expect(log.text.format({})).eql(['{}']);
    });

    it('测试 undefined', function () {
        expect(log.text.format(undefined)).eql([]);
    });

    it('测试 reset 恢复样式', function () {
        expect(log.red.reset.format('a')).eql(['a']);
    });
});

it('测试 插入符号', function () {
    expect(log.linebreak.newline.whitespace.colon.hyphen.verticalBar.line().format(1)).eql([
        '\r\n1\r\n    :  -  | ', `\r\n${'-'.repeat(80)}\r\n`
    ]);
});

it('测试 自定义分隔符', function () {
    expect(log.line('*', 5).format()).eql([`\r\n${'*'.repeat(5)}\r\n`]);
});

it('测试 占位符', function () {
    expect(log.text.location.title.paragraph.section.format(1, 2, 3, 4, 5)).eql([
        1, '[2]', chalk.bold('3\r\n'), '4\r\n', '\r\n5\r\n'
    ]);
});

describe('测试 chalk 样式功能', function () {
    it('测试 全部样式链式调用', function () {
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

    it('测试 单一样式', function () {
        expect(log.red.format('a')).eql([chalk.red('a')]);
        expect(log.bgBlue.format('b')).eql([chalk.bgBlue('b')]);
        expect(log.bold.format('c')).eql([chalk.bold('c')]);
        expect(log.italic.format('d')).eql([chalk.italic('d')]);
        expect(log.underline.format('e')).eql([chalk.underline('e')]);
        expect(log.strikethrough.format('f')).eql([chalk.strikethrough('f')]);
        expect(log.visible.format('g')).eql([chalk.visible('g')]);
        expect(log.hidden.format('h')).eql([chalk.hidden('h')]);
        expect(log.inverse.format('i')).eql([chalk.inverse('i')]);
        expect(log.dim.format('j')).eql([chalk.dim('j')]);
        expect(log.overline.format('k')).eql([chalk.overline('k')]);
        expect(log.gray.format('l')).eql([chalk.gray('l')]);
        expect(log.grey.format('m')).eql([chalk.grey('m')]);
        expect(log.blackBright.format('n')).eql([chalk.blackBright('n')]);
        expect(log.redBright.format('o')).eql([chalk.redBright('o')]);
        expect(log.greenBright.format('p')).eql([chalk.greenBright('p')]);
        expect(log.yellowBright.format('q')).eql([chalk.yellowBright('q')]);
        expect(log.blueBright.format('r')).eql([chalk.blueBright('r')]);
        expect(log.magentaBright.format('s')).eql([chalk.magentaBright('s')]);
        expect(log.cyanBright.format('t')).eql([chalk.cyanBright('t')]);
        expect(log.whiteBright.format('u')).eql([chalk.whiteBright('u')]);
        expect(log.bgBlack.format('v')).eql([chalk.bgBlack('v')]);
        expect(log.bgRed.format('w')).eql([chalk.bgRed('w')]);
        expect(log.bgGreen.format('x')).eql([chalk.bgGreen('x')]);
        expect(log.bgYellow.format('y')).eql([chalk.bgYellow('y')]);
        expect(log.bgBlue.format('z')).eql([chalk.bgBlue('z')]);
        expect(log.bgMagenta.format('A')).eql([chalk.bgMagenta('A')]);
        expect(log.bgCyan.format('B')).eql([chalk.bgCyan('B')]);
        expect(log.bgWhite.format('C')).eql([chalk.bgWhite('C')]);
        expect(log.bgGray.format('D')).eql([chalk.bgGray('D')]);
        expect(log.bgBlackBright.format('E')).eql([chalk.bgBlackBright('E')]);
        expect(log.bgRedBright.format('F')).eql([chalk.bgRedBright('F')]);
        expect(log.bgGreenBright.format('G')).eql([chalk.bgGreenBright('G')]);
        expect(log.bgYellowBright.format('H')).eql([chalk.bgYellowBright('H')]);
        expect(log.bgBlueBright.format('I')).eql([chalk.bgBlueBright('I')]);
        expect(log.bgMagentaBright.format('J')).eql([chalk.bgMagentaBright('J')]);
        expect(log.bgCyanBright.format('K')).eql([chalk.bgCyanBright('K')]);
        expect(log.bgWhiteBright.format('L')).eql([chalk.bgWhiteBright('L')]);
    });
});

describe('测试 颜色等级', function () {
    it('测试 level1', function () {
        expect(log.level1.red.format('a')).eql([new Chalk({ level: 0 }).red('a')]);
    });
    it('测试 level2', function () {
        expect(log.level2.red.format('a')).eql([new Chalk({ level: 1 }).red('a')]);
    });
    it('测试 level3', function () {
        expect(log.level3.red.format('a')).eql([new Chalk({ level: 2 }).red('a')]);
    });
    it('测试 level4', function () {
        expect(log.level4.red.format('a')).eql([new Chalk({ level: 3 }).red('a')]);
    });
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

    it('测试 无参数', function () {
        expect(log.text.red.format()).eql([]);
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

it('测试 formatString', function () {
    expect(log.text.red.text.yellow.text.blue.formatString(1, 2, 3)).eql(
        [chalk.red('1'), chalk.yellow('2'), chalk.blue('3')].join('')
    );
});

it('测试 bind', function () {
    expect(log.text.red.text.yellow.text.blue.format.bind(undefined, 1, 2)(3)).eql(
        [chalk.red('1'), chalk.yellow('2'), chalk.blue('3')]
    );
});

describe('测试 JSON 缩进', function () {
    it('测试 对象', function () {
        expect(log.text.indentJson.format({ a: 1 })).eql([JSON.stringify({ a: 1 }, undefined, 2)]);
    });

    it('测试 数组', function () {
        expect(log.text.indentJson.format([1, 2, 3])).eql([JSON.stringify([1, 2, 3], undefined, 2)]);
    });
});

it('测试 访问不存在属性抛错', function () {
    // @ts-expect-error: 测试不存在属性
    expect(() => log.notExist).throwError(/Cannot read properties of LogFormatter/);
});
