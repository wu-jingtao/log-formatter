import chalk, { Chalk } from 'chalk';
import * as moment from 'moment';

class LogFormatter extends Function {

    //#region 私有属性与方法

    /**
     * 使用console的何种方法打印到控制台
     */
    private _logType: 'log' | 'error' | 'warn' = 'log';

    /**
     * 样式层，如果传入的参数个数大于样式层数，则剩余的参数统统使用最后一层样式渲染
     */
    private _formatLayer: { style: Chalk, template?: (value: string) => string, text?: string, setting?: any }[] = [];

    constructor() {
        super();

        //第一层默认是时间
        this._formatLayer.push({
            style: chalk.gray,
            get text() {
                switch (this.setting) {
                    case 0:
                        return moment().format('[YYYY-MM-DD HH:mm:ss]');

                    case 1: //noTime
                        return moment().format('[YYYY-MM-DD]');

                    case 2: //noDate
                        return moment().format('[HH:mm:ss]');

                    default:
                        return '';
                }
            },
            setting: 0
        });
    }

    /**
     * 将参数转换成字符串
     */
    private _argToString(arg: any): string {
        switch (Object.prototype.toString.call(arg)) {
            case '[object Undefined]':
                return 'undefined';

            case '[object Null]':
                return 'null';

            default:
                break;
        }
    }

    //#endregion

    //#region 格式化输出

    format(...args: any[]): string {
        const result: string[] = [];

        for (let i = 0, j = 0; i < args.length; j++) {
            if (j < this._formatLayer.length) {
                const { style, template, text } = this._formatLayer[j];
                if (text)
                    result.push(style(template ? template(text) : text));
                else {
                    result.push(style)
                }

            } else {

            }
        }

        return result.join('');
    }

    line() { }
    lineWithText() { }

    //#endregion

    //#region 输出类型设置

    get log(): this {
        this._logType = 'log';
        return this;
    }

    get error(): this {
        this._logType = 'error';
        return this;
    }

    get warn(): this {
        this._logType = 'warn';
        return this;
    }

    //#endregion

    //#region 时间格式设置

    get noTime(): this { return this; }
    get noDate(): this { return this; }
    get noDatetime(): this { return this; }

    //#endregion

    //#region 样式分层属性

    get text(): this { return this; }
    get title(): this { return this; }
    get linefeed(): this { return this; }
    get content(): this { return this; }
    get location(): this { return this; }

    //#endregion

    //#region 样式模板

    get square(): this { return this; }
    get round(): this { return this; }
    get mustache(): this { return this; }

    //#endregion
}

export default function a(...text: any[]): void {

}