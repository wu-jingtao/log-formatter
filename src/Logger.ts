import * as _chalk from 'chalk';
import isBrowser from 'is-in-browser';
const chalk: typeof _chalk = isBrowser ? undefined : require.call(undefined, 'chalk');  //浏览器不进行样式格式化，同时防止webpack打包时引入chalk

import { LogType } from './LogType';
import { LoggerPublicProperties } from './LoggerPublicProperties';
import { FormatLayer } from './FormatLayer';

/**
 * 消息模板的构造类
 * 
 * @export
 * @class Logger
 */
export class Logger extends Function {

    /**
     * 日志类型
     */
    private _type = LogType.log;

    /**
     * 样式层数组    
     */
    private readonly _formatArray: FormatLayer[] = [];

    constructor() {
        super();

        // 第一层默认是时间
        this._formatArray.push({
            tag: "time",
            get text() {
                return isBrowser ? `[${(new Date).toLocaleTimeString()}]` : chalk.gray(`[${(new Date).toLocaleTimeString()}]`);
            },
            template: []
        });
    }

    /**
     * 创建新的样式层。
     * 
     * @private
     * @returns {FormatLayer} 返回新创建的层
     * @memberof Logger
     */
    private _newLayer(): FormatLayer {
        const layer = { template: [] };
        this._formatArray.push(layer);
        return layer;
    }

    /**
     * 返回当前层
     * 
     * @private
     * @memberof Logger
     */
    private _currentLayer(): FormatLayer {
        let layer = this._formatArray[this._formatArray.length - 1];
        if (layer.tag === 'time')
            layer = this._newLayer();

        return layer;
    }

    /**
     * 为当前层添加新的样式
     * 
     * @private
     * @param {keyof _chalk.ChalkStyleMap} style chalk 样式的名称
     * @memberof Logger
     */
    private _addStyle(style: keyof _chalk.ChalkStyleMap) {
        const layer = this._currentLayer();

        if (!isBrowser) {   //浏览器没有样式
            layer.style = layer.style === undefined ? chalk[style] : layer.style[style];
        }
    }

    /**
     * 为当前层添加新的样式模板
     * 
     * @private
     * @param {(arg: string) => string} template 样式模板
     * @memberof Logger
     */
    private _addTemplate(template: (arg: string) => string) {
        const layer = this._currentLayer();
        layer.template.push(template);
    }

    format(...text: any[]): any[] {
        const result = [];

        for (let i = 0, j = 0; i < text.length; j++) {
            let txt: string;
            let style: _chalk.ChalkChain | undefined;
            let template: ((arg: string) => string)[];

            if (j < this._formatArray.length) {
                txt = this._formatArray[j].text !== undefined ? this._formatArray[j].text : text[i++];
                style = this._formatArray[j].style;
                template = this._formatArray[j].template;
            } else {   //剩下的参数全部使用最后一种样式进行格式化
                txt = text[i++];
                style = this._formatArray[this._formatArray.length - 1].style;
                template = this._formatArray[this._formatArray.length - 1].template;
            }

            switch (Object.prototype.toString.call(txt)) {  //对特定类型的对象进行特定转换
                case '[object Error]':
                    txt = (<any>txt).stack;
                    break;

                default:
                    if (typeof txt === 'object')
                        txt = JSON.stringify(txt);
                    break;
            }

            if (style !== undefined) {
                txt = style(txt);
            }

            if (template !== undefined) {
                txt = template.reduce((pre, tmp) => tmp(pre), txt);
            }

            result.push(txt);
        }

        return result;
    }

    /**
     * 将格式化后的内容打印到控制台
     * 
     * @param {...any[]} text 要被格式化的内容
     * @memberof Logger
     */
    log(...text: any[]): void {
        switch (this._type) {
            case LogType.log:
                console.log(...this.format(...text));
                break;

            case LogType.warning:
                console.warn(...this.format(...text));
                break;

            case LogType.error:
                console.error(...this.format(...text));
                break;

            default:
                throw new Error('没有对应的日志输出类型：' + this._type);
        }
    }

    /**
     * 包装当前对象
     * 
     * @returns {LoggerPublicProperties} 
     * @memberof Logger
     */
    toProxy(): LoggerPublicProperties {
        return new Proxy(this, {
            apply(target, thisArg, argumentsList) {
                target.log(...argumentsList);
            },
            get(target, property: keyof LoggerPublicProperties, receiver) {
                switch (property) {
                    case 'format':
                        return target.format.bind(target);

                    case 'line':
                        return (char: string = '-', length: number = 30) => console.log('\r\n', char.repeat(length), '\r\n');

                    case 'warn':
                        target._type = LogType.warning;
                        return receiver.yellow;

                    case 'error':
                        target._type = LogType.error;
                        return receiver.red;

                    case 'noTime':
                        if (target._formatArray[0].tag === 'time')
                            target._formatArray.shift();
                        return receiver;

                    case 'text':
                    case 'title':
                        target._newLayer();
                        return receiver;

                    case 'linefeed':
                        target._newLayer().text = '\r\n';
                        return receiver;

                    case 'content':
                        return receiver.linefeed.text;

                    case 'square':
                    case 'location':
                        target._addTemplate((arg) => `[${arg}]`);
                        return receiver;

                    case 'round':
                        target._addTemplate((arg) => `(${arg})`);
                        return receiver;

                    case 'mustache':
                        target._addTemplate((arg) => `{${arg}}`);
                        return receiver;

                    default:    //chalk 样式
                        target._addStyle(property);
                        return receiver;
                }
            }
        }) as any;
    }
}