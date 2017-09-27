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
        /**
         * 当前连缀属性所处的位置
         */
        this.sequenceIndex = 0;
        // 第一层默认是当前时间
        this._formatArray.push({
            tag: "time",
            get text() {
                return is_in_browser_1.default ? `[${(new Date).toLocaleTimeString()}]` : chalk.gray(`[${(new Date).toLocaleTimeString()}]`);
            },
            template: []
        }, { template: [], tag: 'first' });
    }
    /**
     * 返回当前层
     */
    get _currentLayer() {
        return this._formatArray[this._formatArray.length - 1];
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
     * 为当前层添加新的样式
     *
     * @private
     * @param {keyof _chalk.ChalkStyleMap} style chalk 样式的名称
     * @memberof Logger
     */
    _addStyle(style) {
        const layer = this._currentLayer;
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
        const layer = this._currentLayer;
        layer.template.push(template);
    }
    _trigger(property) {
        switch (property) {
            case 'format':
                return this.format.bind(this);
            case 'line':
                return (char = '-', length = 100) => console.log('\r\n', char.repeat(length), '\r\n');
            case 'lineWithText'://双线夹文字
                return (text, char = '-', length = 100) => {
                    let whiteSpace = 0;
                    if (text.length < length) {
                        whiteSpace = (length - text.length) / 2;
                    }
                    console.log('\r\n', char.repeat(length), '\r\n', ' '.repeat(whiteSpace), text, '\r\n', char.repeat(length), '\r\n');
                };
            case 'warn':
                this._type = 1 /* warning */;
                if (this.sequenceIndex === 1) {
                    this.sequenceIndex = 0;
                    this._trigger('yellow');
                }
                else {
                    this._trigger('text');
                    this._trigger('yellow');
                }
                break;
            case 'error':
                this._type = 2 /* error */;
                if (this.sequenceIndex === 1) {
                    this.sequenceIndex = 0;
                    this._trigger('red');
                }
                else {
                    this._trigger('text');
                    this._trigger('red');
                }
                break;
            case 'noTime':
                if (this.sequenceIndex === 1)
                    this.sequenceIndex--;
                this._formatArray[0].skip = true;
                break;
            case 'text':
            case 'title':
                if (this.sequenceIndex !== 1)
                    this._newLayer();
                break;
            case 'linefeed':
                this._trigger('text');
                this._currentLayer.text = '\r\n';
                break;
            case 'content':
                this._trigger('linefeed');
                this._trigger('text');
                break;
            case 'square':
                this._addTemplate((arg) => `[${arg}]`);
                break;
            case 'location':
                this._trigger('text');
                this._trigger('square');
                break;
            case 'round':
                this._addTemplate((arg) => `(${arg})`);
                break;
            case 'mustache':
                this._addTemplate((arg) => `{${arg}}`);
                break;
            default://chalk 样式
                this._addStyle(property);
                break;
        }
    }
    format(...text) {
        const result = [];
        for (let i = 0, j = 0; i < text.length; j++) {
            let txt;
            let style;
            let template;
            if (j < this._formatArray.length) {
                if (this._formatArray[j].skip === true)
                    continue;
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
                    txt = txt.message + ' -> ' + txt.stack;
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
                target.sequenceIndex++;
                const result = target._trigger(property);
                return result === undefined ? receiver : result;
            }
        });
    }
}
exports.Logger = Logger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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O0NBQ0o7QUF6UEQsd0JBeVBDIiwiZmlsZSI6IkxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF9jaGFsayBmcm9tICdjaGFsayc7XHJcbmltcG9ydCBpc0Jyb3dzZXIgZnJvbSAnaXMtaW4tYnJvd3Nlcic7XHJcbmNvbnN0IGNoYWxrOiB0eXBlb2YgX2NoYWxrID0gaXNCcm93c2VyID8gdW5kZWZpbmVkIDogcmVxdWlyZS5jYWxsKHVuZGVmaW5lZCwgJ2NoYWxrJyk7ICAvL+a1j+iniOWZqOS4jei/m+ihjOagt+W8j+agvOW8j+WMlu+8jOWQjOaXtumYsuatondlYnBhY2vmiZPljIXml7blvJXlhaVjaGFsa1xyXG5cclxuaW1wb3J0IHsgTG9nVHlwZSB9IGZyb20gJy4vTG9nVHlwZSc7XHJcbmltcG9ydCB7IExvZ2dlclB1YmxpY1Byb3BlcnRpZXMgfSBmcm9tICcuL0xvZ2dlclB1YmxpY1Byb3BlcnRpZXMnO1xyXG5pbXBvcnQgeyBGb3JtYXRMYXllciB9IGZyb20gJy4vRm9ybWF0TGF5ZXInO1xyXG5cclxuLyoqXHJcbiAqIOa2iOaBr+aooeadv+eahOaehOmAoOexu1xyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTG9nZ2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTG9nZ2VyIGV4dGVuZHMgRnVuY3Rpb24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pel5b+X57G75Z6LXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3R5cGUgPSBMb2dUeXBlLmxvZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIOagt+W8j+WxguaVsOe7hCAgICBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9ybWF0QXJyYXk6IEZvcm1hdExheWVyW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WJjei/nue8gOWxnuaAp+aJgOWkhOeahOS9jee9rlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNlcXVlbmNlSW5kZXggPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIOesrOS4gOWxgum7mOiupOaYr+W9k+WJjeaXtumXtFxyXG4gICAgICAgIHRoaXMuX2Zvcm1hdEFycmF5LnB1c2goe1xyXG4gICAgICAgICAgICB0YWc6IFwidGltZVwiLFxyXG4gICAgICAgICAgICBnZXQgdGV4dCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc0Jyb3dzZXIgPyBgWyR7KG5ldyBEYXRlKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1dYCA6IGNoYWxrLmdyYXkoYFskeyhuZXcgRGF0ZSkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XWApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogW11cclxuICAgICAgICB9LCB7IHRlbXBsYXRlOiBbXSwgdGFnOiAnZmlyc3QnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue5b2T5YmN5bGCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0IF9jdXJyZW50TGF5ZXIoKTogRm9ybWF0TGF5ZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXRBcnJheVt0aGlzLl9mb3JtYXRBcnJheS5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuaWsOeahOagt+W8j+WxguOAglxyXG4gICAgICogXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHJldHVybnMge0Zvcm1hdExheWVyfSDov5Tlm57mlrDliJvlu7rnmoTlsYJcclxuICAgICAqIEBtZW1iZXJvZiBMb2dnZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfbmV3TGF5ZXIoKTogRm9ybWF0TGF5ZXIge1xyXG4gICAgICAgIGNvbnN0IGxheWVyID0geyB0ZW1wbGF0ZTogW10gfTtcclxuICAgICAgICB0aGlzLl9mb3JtYXRBcnJheS5wdXNoKGxheWVyKTtcclxuICAgICAgICByZXR1cm4gbGF5ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuLrlvZPliY3lsYLmt7vliqDmlrDnmoTmoLflvI9cclxuICAgICAqIFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7a2V5b2YgX2NoYWxrLkNoYWxrU3R5bGVNYXB9IHN0eWxlIGNoYWxrIOagt+W8j+eahOWQjeensFxyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9hZGRTdHlsZShzdHlsZToga2V5b2YgX2NoYWxrLkNoYWxrU3R5bGVNYXApIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuX2N1cnJlbnRMYXllcjtcclxuICAgICAgICBpZiAoIWlzQnJvd3NlcikgeyAgIC8v5rWP6KeI5Zmo5rKh5pyJ5qC35byPXHJcbiAgICAgICAgICAgIGxheWVyLnN0eWxlID0gbGF5ZXIuc3R5bGUgPT09IHVuZGVmaW5lZCA/IGNoYWxrW3N0eWxlXSA6IGxheWVyLnN0eWxlW3N0eWxlXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuLrlvZPliY3lsYLmt7vliqDmlrDnmoTmoLflvI/mqKHmnb9cclxuICAgICAqIFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7KGFyZzogc3RyaW5nKSA9PiBzdHJpbmd9IHRlbXBsYXRlIOagt+W8j+aooeadv1xyXG4gICAgICogQG1lbWJlcm9mIExvZ2dlclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9hZGRUZW1wbGF0ZSh0ZW1wbGF0ZTogKGFyZzogc3RyaW5nKSA9PiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuX2N1cnJlbnRMYXllcjtcclxuICAgICAgICBsYXllci50ZW1wbGF0ZS5wdXNoKHRlbXBsYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF90cmlnZ2VyKHByb3BlcnR5OiBrZXlvZiBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzKTogYW55IHtcclxuICAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Zvcm1hdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2xpbmUnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjaGFyOiBzdHJpbmcgPSAnLScsIGxlbmd0aDogbnVtYmVyID0gMTAwKSA9PiBjb25zb2xlLmxvZygnXFxyXFxuJywgY2hhci5yZXBlYXQobGVuZ3RoKSwgJ1xcclxcbicpO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnbGluZVdpdGhUZXh0JzogICAgLy/lj4znur/lpLnmloflrZdcclxuICAgICAgICAgICAgICAgIHJldHVybiAodGV4dDogYW55LCBjaGFyOiBzdHJpbmcgPSAnLScsIGxlbmd0aDogbnVtYmVyID0gMTAwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdoaXRlU3BhY2UgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IGxlbmd0aCkgeyAgICAvL+WxheS4reaYvuekulxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlID0gKGxlbmd0aCAtIHRleHQubGVuZ3RoKSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnXFxyXFxuJywgY2hhci5yZXBlYXQobGVuZ3RoKSwgJ1xcclxcbicsICcgJy5yZXBlYXQod2hpdGVTcGFjZSksIHRleHQsICdcXHJcXG4nLCBjaGFyLnJlcGVhdChsZW5ndGgpLCAnXFxyXFxuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYXNlICd3YXJuJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX3R5cGUgPSBMb2dUeXBlLndhcm5pbmc7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXF1ZW5jZUluZGV4ID09PSAxKSB7IC8v5aaC5p6c5L2N5LqO5byA5aS077yM5YiZ5LiN5re75Yqg5paw5bGCXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXF1ZW5jZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyKCd5ZWxsb3cnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlcigndGV4dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIoJ3llbGxvdycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdlcnJvcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gTG9nVHlwZS5lcnJvcjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlcXVlbmNlSW5kZXggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcXVlbmNlSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIoJ3JlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyKCd0ZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlcigncmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ25vVGltZSc6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXF1ZW5jZUluZGV4ID09PSAxKSAvLyDov5nkuKrmlL7lnKjlvIDlpLTorqHmlbBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcXVlbmNlSW5kZXgtLTsgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Zvcm1hdEFycmF5WzBdLnNraXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcclxuICAgICAgICAgICAgY2FzZSAndGl0bGUnOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VxdWVuY2VJbmRleCAhPT0gMSkgLy/lpoLmnpzkvY3kuo7lvIDlpLTvvIzliJnkvb/nlKhmaXJzdOWxglxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25ld0xheWVyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2xpbmVmZWVkJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIoJ3RleHQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRMYXllci50ZXh0ID0gJ1xcclxcbic7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlcignbGluZWZlZWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIoJ3RleHQnKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnc3F1YXJlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRlbXBsYXRlKChhcmcpID0+IGBbJHthcmd9XWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdsb2NhdGlvbic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyKCd0ZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyKCdzcXVhcmUnKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAncm91bmQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkVGVtcGxhdGUoKGFyZykgPT4gYCgke2FyZ30pYCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ211c3RhY2hlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRlbXBsYXRlKChhcmcpID0+IGB7JHthcmd9fWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OiAgICAvL2NoYWxrIOagt+W8j1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkU3R5bGUocHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdCguLi50ZXh0OiBhbnlbXSk6IGFueVtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGogPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBsZXQgdHh0OiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCBzdHlsZTogX2NoYWxrLkNoYWxrQ2hhaW4gfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogKChhcmc6IHN0cmluZykgPT4gc3RyaW5nKVtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGogPCB0aGlzLl9mb3JtYXRBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mb3JtYXRBcnJheVtqXS5za2lwID09PSB0cnVlKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0eHQgPSB0aGlzLl9mb3JtYXRBcnJheVtqXS50ZXh0ICE9PSB1bmRlZmluZWQgPyB0aGlzLl9mb3JtYXRBcnJheVtqXS50ZXh0IDogdGV4dFtpKytdO1xyXG4gICAgICAgICAgICAgICAgc3R5bGUgPSB0aGlzLl9mb3JtYXRBcnJheVtqXS5zdHlsZTtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGhpcy5fZm9ybWF0QXJyYXlbal0udGVtcGxhdGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7ICAgLy/liankuIvnmoTlj4LmlbDlhajpg6jkvb/nlKjmnIDlkI7kuIDnp43moLflvI/ov5vooYzmoLzlvI/ljJZcclxuICAgICAgICAgICAgICAgIHR4dCA9IHRleHRbaSsrXTtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gdGhpcy5fZm9ybWF0QXJyYXlbdGhpcy5fZm9ybWF0QXJyYXkubGVuZ3RoIC0gMV0uc3R5bGU7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuX2Zvcm1hdEFycmF5W3RoaXMuX2Zvcm1hdEFycmF5Lmxlbmd0aCAtIDFdLnRlbXBsYXRlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0eHQpKSB7ICAvL+WvueeJueWumuexu+Wei+eahOWvueixoei/m+ihjOeJueWumui9rOaNolxyXG4gICAgICAgICAgICAgICAgY2FzZSAnW29iamVjdCBFcnJvcl0nOlxyXG4gICAgICAgICAgICAgICAgICAgIHR4dCA9ICg8YW55PnR4dCkubWVzc2FnZSArICcgLT4gJyArICg8YW55PnR4dCkuc3RhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHR4dCA9PT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR4dCA9IEpTT04uc3RyaW5naWZ5KHR4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzdHlsZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0eHQgPSBzdHlsZSh0eHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGVtcGxhdGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdHh0ID0gdGVtcGxhdGUucmVkdWNlKChwcmUsIHRtcCkgPT4gdG1wKHByZSksIHR4dCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHR4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bCG5qC85byP5YyW5ZCO55qE5YaF5a655omT5Y2w5Yiw5o6n5Yi25Y+wXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7Li4uYW55W119IHRleHQg6KaB6KKr5qC85byP5YyW55qE5YaF5a65XHJcbiAgICAgKiBAbWVtYmVyb2YgTG9nZ2VyXHJcbiAgICAgKi9cclxuICAgIGxvZyguLi50ZXh0OiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5fdHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIExvZ1R5cGUubG9nOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coLi4udGhpcy5mb3JtYXQoLi4udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIExvZ1R5cGUud2FybmluZzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybiguLi50aGlzLmZvcm1hdCguLi50ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTG9nVHlwZS5lcnJvcjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoLi4udGhpcy5mb3JtYXQoLi4udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfmsqHmnInlr7nlupTnmoTml6Xlv5fovpPlh7rnsbvlnovvvJonICsgdGhpcy5fdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YyF6KOF5b2T5YmN5a+56LGhXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzfSBcclxuICAgICAqIEBtZW1iZXJvZiBMb2dnZXJcclxuICAgICAqL1xyXG4gICAgdG9Qcm94eSgpOiBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcclxuICAgICAgICAgICAgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQubG9nKC4uLmFyZ3VtZW50c0xpc3QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eToga2V5b2YgTG9nZ2VyUHVibGljUHJvcGVydGllcywgcmVjZWl2ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zZXF1ZW5jZUluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0YXJnZXQuX3RyaWdnZXIocHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gcmVjZWl2ZXIgOiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSBhcyBhbnk7XHJcbiAgICB9XHJcbn0iXX0=
