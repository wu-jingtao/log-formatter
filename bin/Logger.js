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
                text: "__time__",
                template() {
                    return is_in_browser_1.default ? `[${(new Date).toLocaleTimeString()}]` : chalk.gray(`[${(new Date).toLocaleTimeString()}]`);
                }
            }, {}];
    }
    format(...text) {
        const result = [];
        for (let i = 0, j = 0; i < text.length; j++) {
            let txt;
            let style;
            let template;
            if (j < this._formatArray.length) {
                txt = this._formatArray[j].text !== undefined ? this._formatArray[j].text : text[i++];
                style = this._formatArray[j].style;
                template = this._formatArray[j].template;
            }
            else {
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
    log(...text) {
        switch (this._type) {
            case 0 /* log */:
                console.log(...this.format(...text));
                break;
            case 1 /* warning */:
                console.warn(...this.format(...text));
                break;
            case 2 /* error */:
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
    toProxy() {
        return new Proxy(this, {
            apply(target, thisArg, argumentsList) {
                target.log(...argumentsList);
            },
            get(target, property, receiver) {
                switch (property) {
                    case 'format':
                        return target.format.bind(target);
                    case 'line':
                        return (char = '-', length = 30) => console.log('\r\n', char.repeat(length), '\r\n');
                    case 'warn':
                        target._type = 1 /* warning */;
                        receiver.yellow;
                        return receiver;
                    case 'error':
                        target._type = 2 /* error */;
                        receiver.red;
                        return receiver;
                    case 'noTime':
                        if (target._formatArray[0].text === '__time__')
                            target._formatArray.shift();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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SSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQzVELE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBRXBCLEtBQUssVUFBVTt3QkFDWCxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDNUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFFcEIsUUFBWSxVQUFVO3dCQUNsQixFQUFFLENBQUMsQ0FBQyxDQUFDLHVCQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUNiLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ2xFLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3RGLENBQUM7d0JBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDeEIsQ0FBQztZQUNMLENBQUM7U0FDSixDQUFRLENBQUM7SUFDZCxDQUFDO0NBQ0o7QUExSkQsd0JBMEpDIiwiZmlsZSI6IkxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF9jaGFsayBmcm9tICdjaGFsayc7XHJcbmltcG9ydCBpc0Jyb3dzZXIgZnJvbSAnaXMtaW4tYnJvd3Nlcic7XHJcbmNvbnN0IGNoYWxrOiB0eXBlb2YgX2NoYWxrID0gaXNCcm93c2VyID8gdW5kZWZpbmVkIDogcmVxdWlyZS5jYWxsKHVuZGVmaW5lZCwgJ2NoYWxrJyk7ICAvL+a1j+iniOWZqOS4jei/m+ihjOagt+W8j+agvOW8j+WMlu+8jOWQjOaXtumYsuatondlYnBhY2vmiZPljIXml7blvJXlhaVjaGFsa1xyXG5cclxuaW1wb3J0IHsgTG9nVHlwZSB9IGZyb20gJy4vTG9nVHlwZSc7XHJcbmltcG9ydCB7IExvZ2dlclB1YmxpY1Byb3BlcnRpZXMgfSBmcm9tICcuL0xvZ2dlclB1YmxpY1Byb3BlcnRpZXMnO1xyXG5cclxuLyoqXHJcbiAqIOa2iOaBr+aooeadv+eahOaehOmAoOexu1xyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTG9nZ2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIGV4dGVuZHMgRnVuY3Rpb24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pel5b+X57G75Z6LXHJcbiAgICAgKiBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAbWVtYmVyb2YgTG9nZ2VyXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3R5cGUgPSBMb2dUeXBlLmxvZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+acrOagvOW8j+WMluaVsOe7hCAgICBcclxuICAgICAqIFxyXG4gICAgICogc3R5bGXvvJrlrprkuYnlpb3moLflvI/nmoRjaGFsa+aWueazlSAgICBcclxuICAgICAqIHRleHTvvJrpu5jorqTnmoTmlofmnKzjgILooqvmoLflvI/ljJblkI7kvKDlhaV0ZW1wbGF0Zei/m+S4gOatpeWkhOeQhiAgICBcclxuICAgICAqIHRlbXBsYXRl77ya5qih5p2/XHJcbiAgICAgKiBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAbWVtYmVyb2YgTG9nZ2VyXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2Zvcm1hdEFycmF5OiB7IHN0eWxlPzogX2NoYWxrLkNoYWxrQ2hhaW4sIHRleHQ/OiBzdHJpbmcsIHRlbXBsYXRlPzogKGFyZzogc3RyaW5nKSA9PiBzdHJpbmcgfVtdID0gW3tcclxuICAgICAgICB0ZXh0OiBcIl9fdGltZV9fXCIsXHJcbiAgICAgICAgdGVtcGxhdGUoKSB7ICAgIC8vIOesrOS4gOS4qum7mOiupOaYr+aJk+WNsOaXtumXtFxyXG4gICAgICAgICAgICByZXR1cm4gaXNCcm93c2VyID8gYFskeyhuZXcgRGF0ZSkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XWAgOiBjaGFsay5ncmF5KGBbJHsobmV3IERhdGUpLnRvTG9jYWxlVGltZVN0cmluZygpfV1gKTtcclxuICAgICAgICB9XHJcbiAgICB9LCB7fV07XHJcblxyXG4gICAgZm9ybWF0KC4uLnRleHQ6IGFueVtdKTogYW55W10ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCB0eHQ6IHN0cmluZztcclxuICAgICAgICAgICAgbGV0IHN0eWxlOiBfY2hhbGsuQ2hhbGtDaGFpbiB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlOiAoKGFyZzogc3RyaW5nKSA9PiBzdHJpbmcpIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgaWYgKGogPCB0aGlzLl9mb3JtYXRBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHR4dCA9IHRoaXMuX2Zvcm1hdEFycmF5W2pdLnRleHQgIT09IHVuZGVmaW5lZCA/IHRoaXMuX2Zvcm1hdEFycmF5W2pdLnRleHQgOiB0ZXh0W2krK107XHJcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHRoaXMuX2Zvcm1hdEFycmF5W2pdLnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0aGlzLl9mb3JtYXRBcnJheVtqXS50ZW1wbGF0ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHR4dCA9IHRleHRbaSsrXTtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gdGhpcy5fZm9ybWF0QXJyYXlbdGhpcy5fZm9ybWF0QXJyYXkubGVuZ3RoIC0gMV0uc3R5bGU7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuX2Zvcm1hdEFycmF5W3RoaXMuX2Zvcm1hdEFycmF5Lmxlbmd0aCAtIDFdLnRlbXBsYXRlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3R5bGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdHh0ID0gc3R5bGUodHh0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRlbXBsYXRlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHR4dCA9IHRlbXBsYXRlKHR4dCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHR4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bCG5qC85byP5YyW5ZCO55qE5paH5pys5omT5Y2w5Yiw5o6n5Yi25Y+wXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7Li4uYW55W119IHRleHQg6KaB6KKr5qC85byP5YyW55qE5YaF5a65XHJcbiAgICAgKiBAbWVtYmVyb2YgTG9nZ2VyXHJcbiAgICAgKi9cclxuICAgIGxvZyguLi50ZXh0OiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5fdHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIExvZ1R5cGUubG9nOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coLi4udGhpcy5mb3JtYXQoLi4udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIExvZ1R5cGUud2FybmluZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybiguLi50aGlzLmZvcm1hdCguLi50ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTG9nVHlwZS5lcnJvcjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoLi4udGhpcy5mb3JtYXQoLi4udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfmsqHmnInlr7nlupTnmoTml6Xlv5fovpPlh7rnsbvlnovvvJonICsgdGhpcy5fdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YyF6KOF5b2T5YmN5a+56LGhXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzfSBcclxuICAgICAqIEBtZW1iZXJvZiBMb2dnZXJcclxuICAgICAqL1xyXG4gICAgdG9Qcm94eSgpOiBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcclxuICAgICAgICAgICAgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQubG9nKC4uLmFyZ3VtZW50c0xpc3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eToga2V5b2YgTG9nZ2VyUHVibGljUHJvcGVydGllcywgcmVjZWl2ZXIpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdmb3JtYXQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmZvcm1hdC5iaW5kKHRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xpbmUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNoYXI6IHN0cmluZyA9ICctJywgbGVuZ3RoOiBudW1iZXIgPSAzMCkgPT4gY29uc29sZS5sb2coJ1xcclxcbicsIGNoYXIucmVwZWF0KGxlbmd0aCksICdcXHJcXG4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnd2Fybic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fdHlwZSA9IExvZ1R5cGUud2FybmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZXIueWVsbG93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll90eXBlID0gTG9nVHlwZS5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZXIucmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ25vVGltZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuX2Zvcm1hdEFycmF5WzBdLnRleHQgPT09ICdfX3RpbWVfXycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGl0bGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goe30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goeyB0ZW1wbGF0ZTogKGFyZykgPT4gYFxcclxcbiR7YXJnfWAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGluZWZlZWQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goeyB0ZXh0OiAnXFxyXFxuJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzcXVhcmUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xvY2F0aW9uJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9mb3JtYXRBcnJheS5wdXNoKHsgdGVtcGxhdGU6IChhcmcpID0+IGBbJHthcmd9XWAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncm91bmQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goeyB0ZW1wbGF0ZTogKGFyZykgPT4gYCgke2FyZ30pYCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtdXN0YWNoZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fZm9ybWF0QXJyYXkucHVzaCh7IHRlbXBsYXRlOiAoYXJnKSA9PiBgeyR7YXJnfX1gIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICAgIC8vY2hhbGsg5qC35byPXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNCcm93c2VyKSB7ICAgLy/mtY/op4jlmajmsqHmnInmoLflvI9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpZWNlID0gdGFyZ2V0Ll9mb3JtYXRBcnJheVt0YXJnZXQuX2Zvcm1hdEFycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2Uuc3R5bGUgPSBwaWVjZS5zdHlsZSA9PT0gdW5kZWZpbmVkID8gY2hhbGtbcHJvcGVydHldIDogcGllY2Uuc3R5bGVbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pIGFzIGFueTtcclxuICAgIH1cclxufSJdfQ==
