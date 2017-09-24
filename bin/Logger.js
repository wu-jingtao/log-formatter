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
        super();
        /**
         * 日志类型
         */
        this._type = 0 /* log */;
        /**
         * 样式层数组
         */
        this._formatArray = [];
        // 第一层默认是时间
        this._formatArray.push({
            tag: "time",
            get text() {
                return is_in_browser_1.default ? `[${(new Date).toLocaleTimeString()}]` : chalk.gray(`[${(new Date).toLocaleTimeString()}]`);
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
    _newLayer() {
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
    _currentLayer() {
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
    _addStyle(style) {
        const layer = this._currentLayer();
        if (!is_in_browser_1.default) {
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
    _addTemplate(template) {
        const layer = this._currentLayer();
        layer.template.push(template);
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
            switch (Object.prototype.toString.call(txt)) {
                case '[object Error]':
                    txt = txt.stack;
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
                        return receiver.yellow;
                    case 'error':
                        target._type = 2 /* error */;
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
                    default://chalk 样式
                        target._addStyle(property);
                        return receiver;
                }
            }
        });
    }
}
exports.Logger = Logger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LEdBQUcsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7d0JBQ3pDLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBRXBCLEtBQUssT0FBTzt3QkFDUixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQzt3QkFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFFcEIsS0FBSyxVQUFVO3dCQUNYLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDO29CQUVwQixRQUFZLFVBQVU7d0JBQ2xCLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzNCLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDO1NBQ0osQ0FBUSxDQUFDO0lBQ2QsQ0FBQztDQUNKO0FBbk5ELHdCQW1OQyIsImZpbGUiOiJMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5pbXBvcnQgaXNCcm93c2VyIGZyb20gJ2lzLWluLWJyb3dzZXInO1xyXG5jb25zdCBjaGFsazogdHlwZW9mIF9jaGFsayA9IGlzQnJvd3NlciA/IHVuZGVmaW5lZCA6IHJlcXVpcmUuY2FsbCh1bmRlZmluZWQsICdjaGFsaycpOyAgLy/mtY/op4jlmajkuI3ov5vooYzmoLflvI/moLzlvI/ljJbvvIzlkIzml7bpmLLmraJ3ZWJwYWNr5omT5YyF5pe25byV5YWlY2hhbGtcclxuXHJcbmltcG9ydCB7IExvZ1R5cGUgfSBmcm9tICcuL0xvZ1R5cGUnO1xyXG5pbXBvcnQgeyBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzIH0gZnJvbSAnLi9Mb2dnZXJQdWJsaWNQcm9wZXJ0aWVzJztcclxuaW1wb3J0IHsgRm9ybWF0TGF5ZXIgfSBmcm9tICcuL0Zvcm1hdExheWVyJztcclxuXHJcbi8qKlxyXG4gKiDmtojmga/mqKHmnb/nmoTmnoTpgKDnsbtcclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIExvZ2dlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvZ2dlciBleHRlbmRzIEZ1bmN0aW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaXpeW/l+exu+Wei1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF90eXBlID0gTG9nVHlwZS5sb2c7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLflvI/lsYLmlbDnu4QgICAgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2Zvcm1hdEFycmF5OiBGb3JtYXRMYXllcltdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8g56ys5LiA5bGC6buY6K6k5piv5pe26Ze0XHJcbiAgICAgICAgdGhpcy5fZm9ybWF0QXJyYXkucHVzaCh7XHJcbiAgICAgICAgICAgIHRhZzogXCJ0aW1lXCIsXHJcbiAgICAgICAgICAgIGdldCB0ZXh0KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzQnJvd3NlciA/IGBbJHsobmV3IERhdGUpLnRvTG9jYWxlVGltZVN0cmluZygpfV1gIDogY2hhbGsuZ3JheShgWyR7KG5ldyBEYXRlKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1dYCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiBbXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65paw55qE5qC35byP5bGC44CCXHJcbiAgICAgKiBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcmV0dXJucyB7Rm9ybWF0TGF5ZXJ9IOi/lOWbnuaWsOWIm+W7uueahOWxglxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9uZXdMYXllcigpOiBGb3JtYXRMYXllciB7XHJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB7IHRlbXBsYXRlOiBbXSB9O1xyXG4gICAgICAgIHRoaXMuX2Zvcm1hdEFycmF5LnB1c2gobGF5ZXIpO1xyXG4gICAgICAgIHJldHVybiBsYXllcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuW9k+WJjeWxglxyXG4gICAgICogXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9jdXJyZW50TGF5ZXIoKTogRm9ybWF0TGF5ZXIge1xyXG4gICAgICAgIGxldCBsYXllciA9IHRoaXMuX2Zvcm1hdEFycmF5W3RoaXMuX2Zvcm1hdEFycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmIChsYXllci50YWcgPT09ICd0aW1lJylcclxuICAgICAgICAgICAgbGF5ZXIgPSB0aGlzLl9uZXdMYXllcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gbGF5ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuLrlvZPliY3lsYLmt7vliqDmlrDnmoTmoLflvI9cclxuICAgICAqIFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7a2V5b2YgX2NoYWxrLkNoYWxrU3R5bGVNYXB9IHN0eWxlIGNoYWxrIOagt+W8j+eahOWQjeensFxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9hZGRTdHlsZShzdHlsZToga2V5b2YgX2NoYWxrLkNoYWxrU3R5bGVNYXApIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuX2N1cnJlbnRMYXllcigpO1xyXG5cclxuICAgICAgICBpZiAoIWlzQnJvd3NlcikgeyAgIC8v5rWP6KeI5Zmo5rKh5pyJ5qC35byPXHJcbiAgICAgICAgICAgIGxheWVyLnN0eWxlID0gbGF5ZXIuc3R5bGUgPT09IHVuZGVmaW5lZCA/IGNoYWxrW3N0eWxlXSA6IGxheWVyLnN0eWxlW3N0eWxlXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuLrlvZPliY3lsYLmt7vliqDmlrDnmoTmoLflvI/mqKHmnb9cclxuICAgICAqIFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7KGFyZzogc3RyaW5nKSA9PiBzdHJpbmd9IHRlbXBsYXRlIOagt+W8j+aooeadv1xyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9hZGRUZW1wbGF0ZSh0ZW1wbGF0ZTogKGFyZzogc3RyaW5nKSA9PiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuX2N1cnJlbnRMYXllcigpO1xyXG4gICAgICAgIGxheWVyLnRlbXBsYXRlLnB1c2godGVtcGxhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdCguLi50ZXh0OiBhbnlbXSk6IGFueVtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGogPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBsZXQgdHh0OiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCBzdHlsZTogX2NoYWxrLkNoYWxrQ2hhaW4gfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogKChhcmc6IHN0cmluZykgPT4gc3RyaW5nKVtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGogPCB0aGlzLl9mb3JtYXRBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHR4dCA9IHRoaXMuX2Zvcm1hdEFycmF5W2pdLnRleHQgIT09IHVuZGVmaW5lZCA/IHRoaXMuX2Zvcm1hdEFycmF5W2pdLnRleHQgOiB0ZXh0W2krK107XHJcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHRoaXMuX2Zvcm1hdEFycmF5W2pdLnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0aGlzLl9mb3JtYXRBcnJheVtqXS50ZW1wbGF0ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHsgICAvL+WJqeS4i+eahOWPguaVsOWFqOmDqOS9v+eUqOacgOWQjuS4gOenjeagt+W8j+i/m+ihjOagvOW8j+WMllxyXG4gICAgICAgICAgICAgICAgdHh0ID0gdGV4dFtpKytdO1xyXG4gICAgICAgICAgICAgICAgc3R5bGUgPSB0aGlzLl9mb3JtYXRBcnJheVt0aGlzLl9mb3JtYXRBcnJheS5sZW5ndGggLSAxXS5zdHlsZTtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGhpcy5fZm9ybWF0QXJyYXlbdGhpcy5fZm9ybWF0QXJyYXkubGVuZ3RoIC0gMV0udGVtcGxhdGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHR4dCkpIHsgIC8v5a+554m55a6a57G75Z6L55qE5a+56LGh6L+b6KGM54m55a6a6L2s5o2iXHJcbiAgICAgICAgICAgICAgICBjYXNlICdbb2JqZWN0IEVycm9yXSc6XHJcbiAgICAgICAgICAgICAgICAgICAgdHh0ID0gKDxhbnk+dHh0KS5zdGFjaztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdHh0ID09PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHh0ID0gSlNPTi5zdHJpbmdpZnkodHh0KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHN0eWxlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHR4dCA9IHN0eWxlKHR4dCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0eHQgPSB0ZW1wbGF0ZS5yZWR1Y2UoKHByZSwgdG1wKSA9PiB0bXAocHJlKSwgdHh0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godHh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbmoLzlvI/ljJblkI7nmoTlhoXlrrnmiZPljbDliLDmjqfliLblj7BcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHsuLi5hbnlbXX0gdGV4dCDopoHooqvmoLzlvI/ljJbnmoTlhoXlrrlcclxuICAgICAqIEBtZW1iZXJvZiBMb2dnZXJcclxuICAgICAqL1xyXG4gICAgbG9nKC4uLnRleHQ6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLl90eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTG9nVHlwZS5sb2c6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyguLi50aGlzLmZvcm1hdCguLi50ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTG9nVHlwZS53YXJuaW5nOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKC4uLnRoaXMuZm9ybWF0KC4uLnRleHQpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBMb2dUeXBlLmVycm9yOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciguLi50aGlzLmZvcm1hdCguLi50ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+ayoeacieWvueW6lOeahOaXpeW/l+i+k+WHuuexu+Wei++8micgKyB0aGlzLl90eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDljIXoo4XlvZPliY3lr7nosaFcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge0xvZ2dlclB1YmxpY1Byb3BlcnRpZXN9IFxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICB0b1Byb3h5KCk6IExvZ2dlclB1YmxpY1Byb3BlcnRpZXMge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xyXG4gICAgICAgICAgICBhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5sb2coLi4uYXJndW1lbnRzTGlzdCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldCh0YXJnZXQsIHByb3BlcnR5OiBrZXlvZiBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzLCByZWNlaXZlcikge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Zvcm1hdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuZm9ybWF0LmJpbmQodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGluZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2hhcjogc3RyaW5nID0gJy0nLCBsZW5ndGg6IG51bWJlciA9IDMwKSA9PiBjb25zb2xlLmxvZygnXFxyXFxuJywgY2hhci5yZXBlYXQobGVuZ3RoKSwgJ1xcclxcbicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd3YXJuJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll90eXBlID0gTG9nVHlwZS53YXJuaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXIueWVsbG93O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdlcnJvcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fdHlwZSA9IExvZ1R5cGUuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlci5yZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ25vVGltZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuX2Zvcm1hdEFycmF5WzBdLnRhZyA9PT0gJ3RpbWUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9mb3JtYXRBcnJheS5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpdGxlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9uZXdMYXllcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xpbmVmZWVkJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9uZXdMYXllcigpLnRleHQgPSAnXFxyXFxuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyLmxpbmVmZWVkLnRleHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NxdWFyZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG9jYXRpb24nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2FkZFRlbXBsYXRlKChhcmcpID0+IGBbJHthcmd9XWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JvdW5kJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9hZGRUZW1wbGF0ZSgoYXJnKSA9PiBgKCR7YXJnfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtdXN0YWNoZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fYWRkVGVtcGxhdGUoKGFyZykgPT4gYHske2FyZ319YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogICAgLy9jaGFsayDmoLflvI9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9hZGRTdHlsZShwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pIGFzIGFueTtcclxuICAgIH1cclxufSJdfQ==
