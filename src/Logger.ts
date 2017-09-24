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
export class Logger {

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
     * 
     * @private
     * @memberof Logger
     */
    private readonly _formatArray: { style?: _chalk.ChalkChain, text?: string, template?: (arg: string) => string }[] = [{
        get text() {    // 第一个默认是打印时间
            return isBrowser ? `[${(new Date).toLocaleTimeString()}]` : chalk.gray(`[${(new Date).toLocaleTimeString()}]`);
        }
    }];

    /**
     * 输出格式化后的字符串
     * 
     * @param {...any[]} text 要被格式化的内容
     * @returns {string} 
     * @memberof Logger
     */
    toString(...text: any[]): string {
        let argIndex = 0;   //用到了第几个参数
        return this._formatArray.reduce((pre, cur) => {
            let txt = cur.text !== undefined ? cur.text : text[argIndex++];

            if (cur.style !== undefined) {
                txt = cur.style(txt);
            }

            if (cur.template !== undefined) {
                txt = cur.template(txt);
            }

            return pre + txt;
        }, '');
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
                console.log(this.toString(...text));
                break;

            case LogType.warning:
                console.warn(this.toString(...text));
                break;

            case LogType.error:
                console.error(this.toString(...text));
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
                    case 'toString':
                        return target.toString.bind(target);
                        
                    case 'line':
                        return (char: string = '-', length: number = 30) => console.log('\r\n', char.repeat(length), '\r\n');

                    case 'warn':
                        target._type = LogType.warning;
                        return receiver;

                    case 'error':
                        target._type = LogType.error;
                        return receiver;

                    case 'text':
                    case 'title':
                        target._formatArray.push({});
                        return receiver;

                    case 'content':
                        target._formatArray.push({ template: (arg) => `\r\n${arg}` });
                        return receiver;

                    case 'linefeed':
                        target._formatArray.push({ text: '\r\n' });
                        return receiver;

                    case 'square':
                    case 'location':
                        target._formatArray.push({ template: (arg) => `[${arg}]` });
                        return receiver;

                    case 'round':
                        target._formatArray.push({ template: (arg) => `(${arg})` });
                        return receiver;

                    case 'mustache':
                        target._formatArray.push({ template: (arg) => `{${arg}}` });
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