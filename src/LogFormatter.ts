import * as moment from 'moment';
import * as util from 'util';
import chalk, { Chalk } from 'chalk';

import { IFormatLayer } from './FormatLayer';

export class LogFormatter extends Function {
    //#region 私有属性与方法

    /**
     * 是否自动缩进对象输出
     */
    private _indentJson = false;

    /**
     * 使用console的何种方法打印到控制台
     */
    private _logType: 'log' | 'error' | 'warn' = 'log';

    /**
     * 样式层
     */
    private readonly _formatLayer: IFormatLayer[] = [];

    /**
     * 添加一个未使用样式层
     */
    private get _unusedText(): this {
        this._formatLayer.push({ style: chalk, template: [], setting: { hasUsed: false } });
        return this;
    }

    /**
     * 返回最后一个样式层
     */
    private get _lastFormatLayer(): IFormatLayer {
        return this._formatLayer[this._formatLayer.length - 1];
    }

    /**
     * 获取最后一个样式层并将其设置为已经使用过了
     */
    private get _getLastFormatLayerAndSetHasUsed(): IFormatLayer {
        const lastLayer = this._lastFormatLayer;
        lastLayer.setting.hasUsed = true;
        return lastLayer;
    }

    constructor() {
        super();

        //第一层默认是时间
        this._formatLayer.push({
            style: chalk.gray,
            template: [v => `[${v}]`],
            get text() {
                switch (this.setting.timeFormat) {
                    case 0:
                        return moment().format('YYYY-MM-DD HH:mm:ss');

                    case 1: //noTime
                        return moment().format('YYYY-MM-DD');

                    case 2: //noDate
                        return moment().format('HH:mm:ss');
                }
            },
            setting: {
                hasUsed: true,
                //日期显示格式
                timeFormat: 0,
                //判断是否跳过当前层
                get skip() {
                    return this.timeFormat > 2;
                }
            }
        });

        //再添加一层是为了让用户可以在设置第一个样式之前可以不调用text
        this._unusedText;
    }

    /**
     * 为最后一层设置样式，调用chalk的方法
     */
    private _invokeChalkFunction(name: keyof Chalk, ...args: any[]): this {
        const lastLayer = this._getLastFormatLayerAndSetHasUsed;
        lastLayer.style = (lastLayer.style as any)[name](...args);
        return this;
    }

    /**
     * 为最后一层设置样式，调用chalk的属性
     */
    private _invokeChalkProperty(name: keyof Chalk): this {
        const lastLayer = this._getLastFormatLayerAndSetHasUsed;
        lastLayer.style = (lastLayer.style as any)[name];
        return this;
    }

    //#endregion

    //#region 格式化输出

    /**
     * 格式化传入的参数，但不打印到console
     * 如果样式长度大于参数长度，则只应用对应部分，剩下的样式忽略。如果参数长度大于样式长度，则剩下的参数将应用最后一个样式
     */
    format(...args: any[]): string {
        const result: string[] = [];
        const { style: lastLayerStyle, template: lastLayerTemplate } = this._lastFormatLayer;

        for (let argIndex = 0, formatIndex = 0; argIndex < args.length; formatIndex++) {
            if (formatIndex < this._formatLayer.length) {
                const { style, template, text, setting } = this._formatLayer[formatIndex];
                //判断是否跳过当前层
                if (!setting.skip) {
                    let transformedString: string;

                    if (text !== undefined) {
                        transformedString = template.reduce((pre, template) => template(pre), text);
                    } else {
                        transformedString = template.reduce(
                            (pre, template) => template(pre),
                            util.formatWithOptions({ compact: !this._indentJson }, args[argIndex++])
                        );
                    }

                    result.push(style(transformedString));
                }
            } else {
                const transformedString = lastLayerTemplate.reduce(
                    (pre, template) => template(pre),
                    util.formatWithOptions({ compact: !this._indentJson }, args[argIndex++])
                );
                result.push(lastLayerStyle(transformedString));
            }
        }

        return result.join(' ');
    }

    /**
     * 格式化传入的参数，并把结果打印到console
     */
    print(...args: any[]): void {
        console[this._logType](this.format(...args));
    }

    /**
     * 打印一行分隔符。如果有多个样式被指定，则只有第一个会生效。时间不会被输出
     * @param char 分隔符字符
     * @param length 分隔符长度。默认等于终端窗口长度
     */
    line(char = '-', length: number = process.stdout.columns || 80): void {
        const { style } = this._formatLayer[1];
        console[this._logType](style(char.repeat(length)));
    }

    //#endregion

    //#region 输出类型设置

    /**
     * 通过console.log进行输出，这个是默认选项
     */
    get log(): this {
        this._logType = 'log';
        return this;
    }

    /**
     * 通过console.error进行输出
     */
    get error(): this {
        this._logType = 'error';
        return this;
    }

    /**
     * 通过console.warn进行输出
     */
    get warn(): this {
        this._logType = 'warn';
        return this;
    }

    /**
     * 是否自动缩进对象输出
     */
    get indentJson(): this {
        this._indentJson = true;
        return this;
    }

    //#endregion

    //#region 时间格式设置

    /**
     * 不显示时间
     */
    get noTime(): this {
        (this._formatLayer[0].setting.timeFormat as number) |= 1;
        return this;
    }

    /**
     * 不显示日期
     */
    get noDate(): this {
        (this._formatLayer[0].setting.timeFormat as number) |= 2;
        return this;
    }

    /**
     * 不显示日期与时间
     */
    get noDatetime(): this {
        (this._formatLayer[0].setting.timeFormat as number) |= 3;
        return this;
    }

    //#endregion

    //#region 新建样式层属性

    /**
     * 创建一层新的样式，用于格式化下一个传入参数
     */
    get text(): this {
        const lastLayer = this._lastFormatLayer;
        if (lastLayer.setting.hasUsed)
            this._formatLayer.push({ style: chalk, template: [], setting: { hasUsed: true } });
        //如果最后一层还没有用过就不在添加新的了
        else lastLayer.setting.hasUsed = true;

        return this;
    }

    /**
     * 消息的标题，text的别名
     */
    get title(): this {
        return this.text;
    }

    /**
     * 换行
     */
    get linefeed(): this {
        this.text._lastFormatLayer.text = '\r\n';
        return this._unusedText;
    }

    /**
     * 空格
     */
    get whitespace(): this {
        this.text._lastFormatLayer.text = ' ';
        return this._unusedText;
    }

    /**
     * 消息的正文，相当于linefeed.text
     */
    get content(): this {
        return this.linefeed.text;
    }

    /**
     * 代表消息发生的位置。相当于text.square
     */
    get location(): this {
        return this.text.square;
    }

    //#endregion

    //#region 样式模板

    /**
     * 用方括号包裹要输出的文本内容
     */
    get square(): this {
        this._getLastFormatLayerAndSetHasUsed.template.push(text => `[${text}]`);
        return this;
    }

    /**
     * 用圆括号包裹要输出的文本内容
     */
    get round(): this {
        this._getLastFormatLayerAndSetHasUsed.template.push(text => `(${text})`);
        return this;
    }

    /**
     * 用花括号包裹要输出的文本内容
     */
    get mustache(): this {
        this._getLastFormatLayerAndSetHasUsed.template.push(text => `{${text}}`);
        return this;
    }

    //#endregion

    //#region chalk的方法

    rgb(r: number, g: number, b: number): this {
        return this._invokeChalkFunction('rgb', r, g, b);
    }
    hsl(h: number, s: number, l: number): this {
        return this._invokeChalkFunction('hsl', h, s, l);
    }
    hsv(h: number, s: number, v: number): this {
        return this._invokeChalkFunction('hsv', h, s, v);
    }
    hwb(h: number, w: number, b: number): this {
        return this._invokeChalkFunction('hwb', h, w, b);
    }
    hex(color: string): this {
        return this._invokeChalkFunction('hex', color);
    }
    keyword(color: string): this {
        return this._invokeChalkFunction('keyword', color);
    }
    bgRgb(r: number, g: number, b: number): this {
        return this._invokeChalkFunction('bgRgb', r, g, b);
    }
    bgHsl(h: number, s: number, l: number): this {
        return this._invokeChalkFunction('bgHsl', h, s, l);
    }
    bgHsv(h: number, s: number, v: number): this {
        return this._invokeChalkFunction('bgHsv', h, s, v);
    }
    bgHwb(h: number, w: number, b: number): this {
        return this._invokeChalkFunction('bgHwb', h, w, b);
    }
    bgHex(color: string): this {
        return this._invokeChalkFunction('bgHex', color);
    }
    bgKeyword(color: string): this {
        return this._invokeChalkFunction('bgKeyword', color);
    }

    //#endregion

    //#region chalk的属性

    get reset(): this {
        return this._invokeChalkProperty('reset');
    }
    get bold(): this {
        return this._invokeChalkProperty('bold');
    }
    get dim(): this {
        return this._invokeChalkProperty('dim');
    }
    get italic(): this {
        return this._invokeChalkProperty('italic');
    }
    get underline(): this {
        return this._invokeChalkProperty('underline');
    }
    get inverse(): this {
        return this._invokeChalkProperty('inverse');
    }
    get hidden(): this {
        return this._invokeChalkProperty('hidden');
    }
    get strikethrough(): this {
        return this._invokeChalkProperty('strikethrough');
    }

    get visible(): this {
        return this._invokeChalkProperty('visible');
    }

    get black(): this {
        return this._invokeChalkProperty('black');
    }
    get red(): this {
        return this._invokeChalkProperty('red');
    }
    get green(): this {
        return this._invokeChalkProperty('green');
    }
    get yellow(): this {
        return this._invokeChalkProperty('yellow');
    }
    get blue(): this {
        return this._invokeChalkProperty('blue');
    }
    get magenta(): this {
        return this._invokeChalkProperty('magenta');
    }
    get cyan(): this {
        return this._invokeChalkProperty('cyan');
    }
    get white(): this {
        return this._invokeChalkProperty('white');
    }
    get gray(): this {
        return this._invokeChalkProperty('gray');
    }
    get grey(): this {
        return this._invokeChalkProperty('grey');
    }

    get blackBright(): this {
        return this._invokeChalkProperty('blackBright');
    }
    get redBright(): this {
        return this._invokeChalkProperty('redBright');
    }
    get greenBright(): this {
        return this._invokeChalkProperty('greenBright');
    }
    get yellowBright(): this {
        return this._invokeChalkProperty('yellowBright');
    }
    get blueBright(): this {
        return this._invokeChalkProperty('blueBright');
    }
    get magentaBright(): this {
        return this._invokeChalkProperty('magentaBright');
    }
    get cyanBright(): this {
        return this._invokeChalkProperty('cyanBright');
    }
    get whiteBright(): this {
        return this._invokeChalkProperty('whiteBright');
    }

    get bgBlack(): this {
        return this._invokeChalkProperty('bgBlack');
    }
    get bgRed(): this {
        return this._invokeChalkProperty('bgRed');
    }
    get bgGreen(): this {
        return this._invokeChalkProperty('bgGreen');
    }
    get bgYellow(): this {
        return this._invokeChalkProperty('bgYellow');
    }
    get bgBlue(): this {
        return this._invokeChalkProperty('bgBlue');
    }
    get bgMagenta(): this {
        return this._invokeChalkProperty('bgMagenta');
    }
    get bgCyan(): this {
        return this._invokeChalkProperty('bgCyan');
    }
    get bgWhite(): this {
        return this._invokeChalkProperty('bgWhite');
    }

    get bgBlackBright(): this {
        return this._invokeChalkProperty('bgBlackBright');
    }
    get bgRedBright(): this {
        return this._invokeChalkProperty('bgRedBright');
    }
    get bgGreenBright(): this {
        return this._invokeChalkProperty('bgGreenBright');
    }
    get bgYellowBright(): this {
        return this._invokeChalkProperty('bgYellowBright');
    }
    get bgBlueBright(): this {
        return this._invokeChalkProperty('bgBlueBright');
    }
    get bgMagentaBright(): this {
        return this._invokeChalkProperty('bgMagentaBright');
    }
    get bgCyanBright(): this {
        return this._invokeChalkProperty('bgCyanBright');
    }
    get bgWhiteBright(): this {
        return this._invokeChalkProperty('bgWhiteBright');
    }

    //#endregion
}
