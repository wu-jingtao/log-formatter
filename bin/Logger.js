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
class Logger {
    constructor() {
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
                        return receiver;
                    case 'error':
                        target._type = 2 /* error */;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlEQUFzQztBQUN0QyxNQUFNLEtBQUssR0FBa0IsdUJBQVMsR0FBRyxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBRSxtQ0FBbUM7QUFLM0g7Ozs7O0dBS0c7QUFDSDtJQUFBO1FBRUk7Ozs7O1dBS0c7UUFDSyxVQUFLLGVBQWU7UUFFNUI7Ozs7Ozs7OztXQVNHO1FBQ2MsaUJBQVksR0FBdUYsQ0FBQztnQkFDakgsSUFBSSxJQUFJO29CQUNKLE1BQU0sQ0FBQyx1QkFBUyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNuSCxDQUFDO2FBQ0osQ0FBQyxDQUFDO0lBa0hQLENBQUM7SUFoSEc7Ozs7OztPQU1HO0lBQ0gsUUFBUSxDQUFDLEdBQUcsSUFBVztRQUNuQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBRyxVQUFVO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHO1lBQ3JDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFL0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDckIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsR0FBRyxDQUFDLEdBQUcsSUFBVztRQUNkLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pCO2dCQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLEtBQUssQ0FBQztZQUVWO2dCQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLEtBQUssQ0FBQztZQUVWO2dCQUNJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLEtBQUssQ0FBQztZQUVWO2dCQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsT0FBTztRQUNILE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDbkIsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYTtnQkFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQXNDLEVBQUUsUUFBUTtnQkFDeEQsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDZixLQUFLLFVBQVU7d0JBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUV4QyxLQUFLLE1BQU07d0JBQ1AsTUFBTSxDQUFDLENBQUMsT0FBZSxHQUFHLEVBQUUsU0FBaUIsRUFBRSxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBRXpHLEtBQUssTUFBTTt3QkFDUCxNQUFNLENBQUMsS0FBSyxrQkFBa0IsQ0FBQzt3QkFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFFcEIsS0FBSyxPQUFPO3dCQUNSLE1BQU0sQ0FBQyxLQUFLLGdCQUFnQixDQUFDO3dCQUM3QixNQUFNLENBQUMsUUFBUSxDQUFDO29CQUVwQixLQUFLLE1BQU0sQ0FBQztvQkFDWixLQUFLLE9BQU87d0JBQ1IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBRXBCLEtBQUssU0FBUzt3QkFDVixNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsS0FBSyxPQUFPLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDOUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFFcEIsS0FBSyxVQUFVO3dCQUNYLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7d0JBQzNDLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBRXBCLEtBQUssUUFBUSxDQUFDO29CQUNkLEtBQUssVUFBVTt3QkFDWCxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDNUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFFcEIsS0FBSyxPQUFPO3dCQUNSLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxLQUFLLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUM1RCxNQUFNLENBQUMsUUFBUSxDQUFDO29CQUVwQixLQUFLLFVBQVU7d0JBQ1gsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFHLEtBQUssSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQzVELE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBRXBCLFFBQVksVUFBVTt3QkFDbEIsRUFBRSxDQUFDLENBQUMsQ0FBQyx1QkFBUyxDQUFDLENBQUMsQ0FBQzs0QkFDYixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNsRSxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUN0RixDQUFDO3dCQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDO1NBQ0osQ0FBUSxDQUFDO0lBQ2QsQ0FBQztDQUNKO0FBMUlELHdCQTBJQyIsImZpbGUiOiJMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5pbXBvcnQgaXNCcm93c2VyIGZyb20gJ2lzLWluLWJyb3dzZXInO1xyXG5jb25zdCBjaGFsazogdHlwZW9mIF9jaGFsayA9IGlzQnJvd3NlciA/IHVuZGVmaW5lZCA6IHJlcXVpcmUuY2FsbCh1bmRlZmluZWQsICdjaGFsaycpOyAgLy/mtY/op4jlmajkuI3ov5vooYzmoLflvI/moLzlvI/ljJbvvIzlkIzml7bpmLLmraJ3ZWJwYWNr5omT5YyF5pe25byV5YWlY2hhbGtcclxuXHJcbmltcG9ydCB7IExvZ1R5cGUgfSBmcm9tICcuL0xvZ1R5cGUnO1xyXG5pbXBvcnQgeyBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzIH0gZnJvbSAnLi9Mb2dnZXJQdWJsaWNQcm9wZXJ0aWVzJztcclxuXHJcbi8qKlxyXG4gKiDmtojmga/mqKHmnb/nmoTmnoTpgKDnsbtcclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIExvZ2dlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDml6Xlv5fnsbvlnotcclxuICAgICAqIFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBtZW1iZXJvZiBMb2dnZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfdHlwZSA9IExvZ1R5cGUubG9nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5paH5pys5qC85byP5YyW5pWw57uEICAgIFxyXG4gICAgICogXHJcbiAgICAgKiBzdHlsZe+8muWumuS5ieWlveagt+W8j+eahGNoYWxr5pa55rOVICAgIFxyXG4gICAgICogdGV4dO+8mum7mOiupOeahOaWh+acrOOAguiiq+agt+W8j+WMluWQjuS8oOWFpXRlbXBsYXRl6L+b5LiA5q2l5aSE55CGICAgIFxyXG4gICAgICogdGVtcGxhdGXvvJrmqKHmnb9cclxuICAgICAqIFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBtZW1iZXJvZiBMb2dnZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9ybWF0QXJyYXk6IHsgc3R5bGU/OiBfY2hhbGsuQ2hhbGtDaGFpbiwgdGV4dD86IHN0cmluZywgdGVtcGxhdGU/OiAoYXJnOiBzdHJpbmcpID0+IHN0cmluZyB9W10gPSBbe1xyXG4gICAgICAgIGdldCB0ZXh0KCkgeyAgICAvLyDnrKzkuIDkuKrpu5jorqTmmK/miZPljbDml7bpl7RcclxuICAgICAgICAgICAgcmV0dXJuIGlzQnJvd3NlciA/IGBbJHsobmV3IERhdGUpLnRvTG9jYWxlVGltZVN0cmluZygpfV1gIDogY2hhbGsuZ3JheShgWyR7KG5ldyBEYXRlKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1dYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfV07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDovpPlh7rmoLzlvI/ljJblkI7nmoTlrZfnrKbkuLJcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHsuLi5hbnlbXX0gdGV4dCDopoHooqvmoLzlvI/ljJbnmoTlhoXlrrlcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICB0b1N0cmluZyguLi50ZXh0OiBhbnlbXSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGFyZ0luZGV4ID0gMDsgICAvL+eUqOWIsOS6huesrOWHoOS4quWPguaVsFxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXRBcnJheS5yZWR1Y2UoKHByZSwgY3VyKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0eHQgPSBjdXIudGV4dCAhPT0gdW5kZWZpbmVkID8gY3VyLnRleHQgOiB0ZXh0W2FyZ0luZGV4KytdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1ci5zdHlsZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0eHQgPSBjdXIuc3R5bGUodHh0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1ci50ZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0eHQgPSBjdXIudGVtcGxhdGUodHh0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByZSArIHR4dDtcclxuICAgICAgICB9LCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbmoLzlvI/ljJblkI7nmoTmlofmnKzmiZPljbDliLDmjqfliLblj7BcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHsuLi5hbnlbXX0gdGV4dCDopoHooqvmoLzlvI/ljJbnmoTlhoXlrrlcclxuICAgICAqIEBtZW1iZXJvZiBMb2dnZXJcclxuICAgICAqL1xyXG4gICAgbG9nKC4uLnRleHQ6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLl90eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTG9nVHlwZS5sb2c6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnRvU3RyaW5nKC4uLnRleHQpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBMb2dUeXBlLndhcm5pbmc6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4odGhpcy50b1N0cmluZyguLi50ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTG9nVHlwZS5lcnJvcjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy50b1N0cmluZyguLi50ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+ayoeacieWvueW6lOeahOaXpeW/l+i+k+WHuuexu+Wei++8micgKyB0aGlzLl90eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDljIXoo4XlvZPliY3lr7nosaFcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge0xvZ2dlclB1YmxpY1Byb3BlcnRpZXN9IFxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICB0b1Byb3h5KCk6IExvZ2dlclB1YmxpY1Byb3BlcnRpZXMge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xyXG4gICAgICAgICAgICBhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5sb2coLi4uYXJndW1lbnRzTGlzdCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldCh0YXJnZXQsIHByb3BlcnR5OiBrZXlvZiBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzLCByZWNlaXZlcikge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RvU3RyaW5nJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC50b1N0cmluZy5iaW5kKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xpbmUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNoYXI6IHN0cmluZyA9ICctJywgbGVuZ3RoOiBudW1iZXIgPSAzMCkgPT4gY29uc29sZS5sb2coJ1xcclxcbicsIGNoYXIucmVwZWF0KGxlbmd0aCksICdcXHJcXG4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnd2Fybic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fdHlwZSA9IExvZ1R5cGUud2FybmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdlcnJvcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fdHlwZSA9IExvZ1R5cGUuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGl0bGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goe30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goeyB0ZW1wbGF0ZTogKGFyZykgPT4gYFxcclxcbiR7YXJnfWAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGluZWZlZWQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goeyB0ZXh0OiAnXFxyXFxuJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzcXVhcmUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xvY2F0aW9uJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Ll9mb3JtYXRBcnJheS5wdXNoKHsgdGVtcGxhdGU6IChhcmcpID0+IGBbJHthcmd9XWAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncm91bmQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuX2Zvcm1hdEFycmF5LnB1c2goeyB0ZW1wbGF0ZTogKGFyZykgPT4gYCgke2FyZ30pYCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtdXN0YWNoZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5fZm9ybWF0QXJyYXkucHVzaCh7IHRlbXBsYXRlOiAoYXJnKSA9PiBgeyR7YXJnfX1gIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICAgIC8vY2hhbGsg5qC35byPXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNCcm93c2VyKSB7ICAgLy/mtY/op4jlmajmsqHmnInmoLflvI9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpZWNlID0gdGFyZ2V0Ll9mb3JtYXRBcnJheVt0YXJnZXQuX2Zvcm1hdEFycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2Uuc3R5bGUgPSBwaWVjZS5zdHlsZSA9PT0gdW5kZWZpbmVkID8gY2hhbGtbcHJvcGVydHldIDogcGllY2Uuc3R5bGVbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pIGFzIGFueTtcclxuICAgIH1cclxufSJdfQ==
