import * as _chalk from 'chalk';
import isBrowser from 'is-in-browser';
const chalk: typeof _chalk = isBrowser ? undefined : require.call(undefined, 'chalk');  //浏览器不进行样式格式化，同时防止webpack打包时引入chalk

import { LogType } from './LogType';
import { LoggerPublicProperties } from './LoggerPublicProperties';

/**
 * 消息模板的构造类
 * 
 * @export
 * @class Logger
 */
export class Logger extends Function {

    /**
     * 日志类型
     * 
     * @private
     * @memberof Logger
     */
    private _type = LogType.log;

    /**
     * 文本格式化数组    
     * 
     * style：定义好样式的chalk方法    
     * text：默认的文本。被样式化后传入template进一步处理    
     * template：模板    
     * tag：内部使用，对这条消息提供一些额外的描述信息
     * 
     * @private
     * @memberof Logger
     */
    private readonly _formatArray: { style?: _chalk.ChalkChain, text?: string, template?: (arg: string) => string, tag?: string }[] = [{
        tag: "time",
        get text() {    // 第一个默认是打印时间
            return isBrowser ? `[${(new Date).toLocaleTimeString()}]` : chalk.gray(`[${(new Date).toLocaleTimeString()}]`);
        }
    }, { tag: 'first' }];

    format(...text: any[]): any[] {
        const result = [];

        for (let i = 0, j = 0; i < text.length; j++) {
            let txt: string;
            let style: _chalk.ChalkChain | undefined;
            let template: ((arg: string) => string) | undefined;

            if (j < this._formatArray.length) {
                txt = this._formatArray[j].text !== undefined ? this._formatArray[j].text : text[i++];
                style = this._formatArray[j].style;
                template = this._formatArray[j].template;
            } else {
                txt = text[i++];
                style = this._formatArray[this._formatArray.length - 1].style;
                template = this._formatArray[this._formatArray.length - 1].template;
            }

            if (style !== undefined) {
                txt = style(txt);
            }

            if (template !== undefined) {
                txt = template(txt);
            }

            result.push(txt);
        }

        return result;
    }

    /**
     * 将格式化后的文本打印到控制台
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
                        if (target._formatArray[target._formatArray.length - 1].tag !== 'first')
                            target._formatArray.push({});
                        else
                            target._formatArray[target._formatArray.length - 1].tag = undefined;
                        return receiver;

                    case 'content':
                        if (target._formatArray[target._formatArray.length - 1].tag !== 'first')
                            target._formatArray.push({ template: (arg) => `\r\n${arg}` });
                        else {
                            target._formatArray[target._formatArray.length - 1].template = (arg) => `\r\n${arg}`;
                            target._formatArray[target._formatArray.length - 1].tag = undefined;
                        }
                        return receiver;

                    case 'linefeed':
                        if (target._formatArray[target._formatArray.length - 1].tag !== 'first')
                            target._formatArray.push({ text: '\r\n' });
                        else {
                            target._formatArray[target._formatArray.length - 1].text = '\r\n';
                            target._formatArray[target._formatArray.length - 1].tag = undefined;
                        }
                        return receiver;

                    case 'square':
                    case 'location':
                        if (target._formatArray[target._formatArray.length - 1].tag !== 'first')
                            target._formatArray.push({ template: (arg) => `[${arg}]` });
                        else {
                            target._formatArray[target._formatArray.length - 1].template = (arg) => `[${arg}]`;
                            target._formatArray[target._formatArray.length - 1].tag = undefined;
                        }
                        return receiver;

                    case 'round':
                        if (target._formatArray[target._formatArray.length - 1].tag !== 'first')
                            target._formatArray.push({ template: (arg) => `(${arg})` });
                        else {
                            target._formatArray[target._formatArray.length - 1].template = (arg) => `(${arg})`;
                            target._formatArray[target._formatArray.length - 1].tag = undefined;
                        }
                        return receiver;

                    case 'mustache':
                        if (target._formatArray[target._formatArray.length - 1].tag !== 'first')
                            target._formatArray.push({ template: (arg) => `{${arg}}` });
                        else {
                            target._formatArray[target._formatArray.length - 1].template = (arg) => `{${arg}}`;
                            target._formatArray[target._formatArray.length - 1].tag = undefined;
                        }
                        return receiver;

                    default:    //chalk 样式
                        if (!isBrowser) {   //浏览器没有样式
                            const piece = target._formatArray[target._formatArray.length - 1];
                            piece.style = piece.style === undefined ? chalk[property] : piece.style[property];
                        }
                        return receiver;
                }
            }
        }) as any;
    }
}