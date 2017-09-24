"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_in_browser_1 = require("is-in-browser");
const chalk = is_in_browser_1.default ? undefined : require.call(undefined, 'chalk'); //浏览器不进行样式格式化，同时防止webpack打包时引入chalk
/**
 * 消息模板的构造类
 *
 * @export
 * @class Logger
 */
class Logger extends Function {
    constructor() {
        super(...arguments);
        /**
         * 日志类型
         *
         * @private
         * @memberof Logger
         */
        this._type = 0 /* log */;
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
        this._formatArray = [{
                get text() {
                    return is_in_browser_1.default ? `[${(new Date).toLocaleTimeString()}]` : chalk.gray(`[${(new Date).toLocaleTimeString()}]`);
                }
            }];
    }
    /**
     * 输出格式化后的字符串
     *
     * @param {...any[]} text 要被格式化的内容
     * @returns {string}
     * @memberof Logger
     */
    toString(...text) {
        let argIndex = 0; //用到了第几个参数
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
    log(...text) {
        switch (this._type) {
            case 0 /* log */:
                console.log(this.toString(...text));
                break;
            case 1 /* warning */:
                console.warn(this.toString(...text));
                break;
            case 2 /* error */:
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
    toProxy() {
        return new Proxy(this, {
            apply(target, thisArg, argumentsList) {
                target.log(...argumentsList);
            },
            get(target, property, receiver) {
                switch (property) {
                    case 'toString':
                        return target.toString.bind(target);
                    case 'line':
                        return (char = '-', length = 30) => console.log('\r\n', char.repeat(length), '\r\n');
                    case 'warn':
                        target._type = 1 /* warning */;
                        if (target._formatArray.length === 1)
                            target._formatArray.push({});
                        return receiver;
                    case 'error':
                        target._type = 2 /* error */;
                        if (target._formatArray.length === 1)
                            target._formatArray.push({});
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
                    default://chalk 样式
                        if (!is_in_browser_1.default) {
                            const piece = target._formatArray[target._formatArray.length - 1];
                            piece.style = piece.style === undefined ? chalk[property] : piece.style[property];
                        }
                        return receiver;
                }
            }
        });
    }
}
exports.Logger = Logger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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WyJpbXBvcnQgKiBhcyBfY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5pbXBvcnQgaXNCcm93c2VyIGZyb20gJ2lzLWluLWJyb3dzZXInO1xyXG5jb25zdCBjaGFsazogdHlwZW9mIF9jaGFsayA9IGlzQnJvd3NlciA/IHVuZGVmaW5lZCA6IHJlcXVpcmUuY2FsbCh1bmRlZmluZWQsICdjaGFsaycpOyAgLy/mtY/op4jlmajkuI3ov5vooYzmoLflvI/moLzlvI/ljJbvvIzlkIzml7bpmLLmraJ3ZWJwYWNr5omT5YyF5pe25byV5YWlY2hhbGtcclxuXHJcbmltcG9ydCB7IExvZ1R5cGUgfSBmcm9tICcuL0xvZ1R5cGUnO1xyXG5pbXBvcnQgeyBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzIH0gZnJvbSAnLi9Mb2dnZXJQdWJsaWNQcm9wZXJ0aWVzJztcclxuXHJcbi8qKlxyXG4gKiDmtojmga/mqKHmnb/nmoTmnoTpgKDnsbtcclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIExvZ2dlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvZ2dlciBleHRlbmRzIEZ1bmN0aW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaXpeW/l+exu+Wei1xyXG4gICAgICogXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF90eXBlID0gTG9nVHlwZS5sb2c7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmlofmnKzmoLzlvI/ljJbmlbDnu4QgICAgXHJcbiAgICAgKiBcclxuICAgICAqIHN0eWxl77ya5a6a5LmJ5aW95qC35byP55qEY2hhbGvmlrnms5UgICAgXHJcbiAgICAgKiB0ZXh077ya6buY6K6k55qE5paH5pys44CC6KKr5qC35byP5YyW5ZCO5Lyg5YWldGVtcGxhdGXov5vkuIDmraXlpITnkIYgICAgXHJcbiAgICAgKiB0ZW1wbGF0Ze+8muaooeadv1xyXG4gICAgICogXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9mb3JtYXRBcnJheTogeyBzdHlsZT86IF9jaGFsay5DaGFsa0NoYWluLCB0ZXh0Pzogc3RyaW5nLCB0ZW1wbGF0ZT86IChhcmc6IHN0cmluZykgPT4gc3RyaW5nIH1bXSA9IFt7XHJcbiAgICAgICAgZ2V0IHRleHQoKSB7ICAgIC8vIOesrOS4gOS4qum7mOiupOaYr+aJk+WNsOaXtumXtFxyXG4gICAgICAgICAgICByZXR1cm4gaXNCcm93c2VyID8gYFskeyhuZXcgRGF0ZSkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XWAgOiBjaGFsay5ncmF5KGBbJHsobmV3IERhdGUpLnRvTG9jYWxlVGltZVN0cmluZygpfV1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi+k+WHuuagvOW8j+WMluWQjueahOWtl+espuS4slxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gey4uLmFueVtdfSB0ZXh0IOimgeiiq+agvOW8j+WMlueahOWGheWuuVxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gXHJcbiAgICAgKiBAbWVtYmVyb2YgTG9nZ2VyXHJcbiAgICAgKi9cclxuICAgIHRvU3RyaW5nKC4uLnRleHQ6IGFueVtdKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgYXJnSW5kZXggPSAwOyAgIC8v55So5Yiw5LqG56ys5Yeg5Liq5Y+C5pWwXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdEFycmF5LnJlZHVjZSgocHJlLCBjdXIpID0+IHtcclxuICAgICAgICAgICAgbGV0IHR4dCA9IGN1ci50ZXh0ICE9PSB1bmRlZmluZWQgPyBjdXIudGV4dCA6IHRleHRbYXJnSW5kZXgrK107XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VyLnN0eWxlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHR4dCA9IGN1ci5zdHlsZSh0eHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VyLnRlbXBsYXRlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHR4dCA9IGN1ci50ZW1wbGF0ZSh0eHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJlICsgdHh0O1xyXG4gICAgICAgIH0sICcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuagvOW8j+WMluWQjueahOaWh+acrOaJk+WNsOWIsOaOp+WItuWPsFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gey4uLmFueVtdfSB0ZXh0IOimgeiiq+agvOW8j+WMlueahOWGheWuuVxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBsb2coLi4udGV4dDogYW55W10pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuX3R5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBMb2dUeXBlLmxvZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMudG9TdHJpbmcoLi4udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIExvZ1R5cGUud2FybmluZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybih0aGlzLnRvU3RyaW5nKC4uLnRleHQpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBMb2dUeXBlLmVycm9yOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnRvU3RyaW5nKC4uLnRleHQpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign5rKh5pyJ5a+55bqU55qE5pel5b+X6L6T5Ye657G75Z6L77yaJyArIHRoaXMuX3R5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWMheijheW9k+WJjeWvueixoVxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyB7TG9nZ2VyUHVibGljUHJvcGVydGllc30gXHJcbiAgICAgKiBAbWVtYmVyb2YgTG9nZ2VyXHJcbiAgICAgKi9cclxuICAgIHRvUHJveHkoKTogTG9nZ2VyUHVibGljUHJvcGVydGllcyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XHJcbiAgICAgICAgICAgIGFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmxvZyguLi5hcmd1bWVudHNMaXN0KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0KHRhcmdldCwgcHJvcGVydHk6IGtleW9mIExvZ2dlclB1YmxpY1Byb3BlcnRpZXMsIHJlY2VpdmVyKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndG9TdHJpbmcnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0LnRvU3RyaW5nLmJpbmQodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGluZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2hhcjogc3RyaW5nID0gJy0nLCBsZW5ndGg6IG51bWJlciA9IDMwKSA9PiBjb25zb2xlLmxvZygnXFxyXFxuJywgY2hhci5yZXBlYXQobGVuZ3RoKSwgJ1xcclxcbicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd3YXJuJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll90eXBlID0gTG9nVHlwZS53YXJuaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Ll9mb3JtYXRBcnJheS5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goe30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll90eXBlID0gTG9nVHlwZS5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5fZm9ybWF0QXJyYXkubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9mb3JtYXRBcnJheS5wdXNoKHt9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0aXRsZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fZm9ybWF0QXJyYXkucHVzaCh7fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fZm9ybWF0QXJyYXkucHVzaCh7IHRlbXBsYXRlOiAoYXJnKSA9PiBgXFxyXFxuJHthcmd9YCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsaW5lZmVlZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fZm9ybWF0QXJyYXkucHVzaCh7IHRleHQ6ICdcXHJcXG4nIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NxdWFyZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG9jYXRpb24nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goeyB0ZW1wbGF0ZTogKGFyZykgPT4gYFske2FyZ31dYCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdyb3VuZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fZm9ybWF0QXJyYXkucHVzaCh7IHRlbXBsYXRlOiAoYXJnKSA9PiBgKCR7YXJnfSlgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ211c3RhY2hlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9mb3JtYXRBcnJheS5wdXNoKHsgdGVtcGxhdGU6IChhcmcpID0+IGB7JHthcmd9fWAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogICAgLy9jaGFsayDmoLflvI9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Jyb3dzZXIpIHsgICAvL+a1j+iniOWZqOayoeacieagt+W8j1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGllY2UgPSB0YXJnZXQuX2Zvcm1hdEFycmF5W3RhcmdldC5fZm9ybWF0QXJyYXkubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5zdHlsZSA9IHBpZWNlLnN0eWxlID09PSB1bmRlZmluZWQgPyBjaGFsa1twcm9wZXJ0eV0gOiBwaWVjZS5zdHlsZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkgYXMgYW55O1xyXG4gICAgfVxyXG59Il19
