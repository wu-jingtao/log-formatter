"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const moment = require("moment");
const chalk_1 = require("chalk");
class LogFormatter extends Function {
    constructor() {
        super();
        //#region 私有属性与方法
        /**
         * 是否自动缩进对象输出
         */
        this._indentJson = false;
        /**
         * 使用console的何种方法打印到控制台
         */
        this._logType = 'log';
        /**
         * 样式层
         */
        this._formatLayer = [];
        //第一层默认是时间
        this._formatLayer.push({
            style: chalk_1.default.gray,
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
                timeFormat: 0,
                get skip() {
                    return this.timeFormat > 2;
                }
            }
        });
        //再添加一层是为了让用户可以在设置第一个样式之前可以不调用text
        this._unusedText;
    }
    /**
     * 添加一个未使用样式层
     */
    get _unusedText() {
        this._formatLayer.push({ style: chalk_1.default, template: [], setting: { hasUsed: false } });
        return this;
    }
    /**
     * 返回最后一个样式层
     */
    get _lastFormatLayer() {
        return this._formatLayer[this._formatLayer.length - 1];
    }
    /**
     * 获取最后一个样式层并将其设置为已经使用过了
     */
    get _getLastFormatLayerAndSetHasUsed() {
        const lastLayer = this._lastFormatLayer;
        lastLayer.setting.hasUsed = true;
        return lastLayer;
    }
    /**
     * 为最后一层设置样式，调用chalk的方法
     */
    _invokeChalkFunction(name, ...args) {
        const lastLayer = this._getLastFormatLayerAndSetHasUsed;
        lastLayer.style = lastLayer.style[name](...args);
        return this;
    }
    /**
     * 为最后一层设置样式，调用chalk的属性
     */
    _invokeChalkProperty(name) {
        const lastLayer = this._getLastFormatLayerAndSetHasUsed;
        lastLayer.style = lastLayer.style[name];
        return this;
    }
    //#endregion
    //#region 格式化输出
    /**
     * 格式化传入的参数，但不打印到console
     * 如果样式长度大于参数长度，则只应用对应部分，剩下的样式忽略。如果参数长度大于样式长度，则剩下的参数将应用最后一个样式
     */
    format(...args) {
        const result = [];
        const { style: lastLayerStyle, template: lastLayerTemplate } = this._lastFormatLayer;
        for (let arg_index = 0, format_index = 0; arg_index < args.length; format_index++) {
            if (format_index < this._formatLayer.length) {
                const { style, template, text, setting } = this._formatLayer[format_index];
                if (!setting.skip) { //判断是否跳过当前层
                    let transformed_string;
                    if (text !== undefined)
                        transformed_string = template.reduce((pre, template) => template(pre), text);
                    else
                        transformed_string = template.reduce((pre, template) => template(pre), util /* 这里由于 tsd 缺失了定义，等待版本更新后可以删除 */.formatWithOptions({ compact: !this._indentJson }, args[arg_index++]));
                    result.push(style(transformed_string));
                }
            }
            else {
                const transformed_string = lastLayerTemplate.reduce((pre, template) => template(pre), util.formatWithOptions({ compact: !this._indentJson }, args[arg_index++]));
                result.push(lastLayerStyle(transformed_string));
            }
        }
        return result.join(' ');
    }
    /**
     * 格式化传入的参数，并把结果打印到console
     */
    print(...args) {
        console[this._logType](this.format(...args));
    }
    /**
     * 打印一行分隔符。如果有多个样式被指定，则只有第一个会生效。时间不会被输出
     * @param char 分隔符字符
     * @param length 分隔符长度。默认等于终端窗口长度
     */
    line(char = '-', length = process.stdout.columns || 80) {
        const { style } = this._formatLayer[1];
        console[this._logType](style(char.repeat(length)));
    }
    //#endregion
    //#region 输出类型设置
    /**
     * 通过console.log进行输出，这个是默认选项
     */
    get log() {
        this._logType = 'log';
        return this;
    }
    /**
     * 通过console.error进行输出
     */
    get error() {
        this._logType = 'error';
        return this;
    }
    /**
     * 通过console.warn进行输出
     */
    get warn() {
        this._logType = 'warn';
        return this;
    }
    /**
     * 是否自动缩进对象输出
     */
    get indentJson() {
        this._indentJson = true;
        return this;
    }
    //#endregion
    //#region 时间格式设置
    /**
     * 不显示时间
     */
    get noTime() {
        this._formatLayer[0].setting.timeFormat |= 1;
        return this;
    }
    /**
     * 不显示日期
     */
    get noDate() {
        this._formatLayer[0].setting.timeFormat |= 2;
        return this;
    }
    /**
     * 不显示日期与时间
     */
    get noDatetime() {
        this._formatLayer[0].setting.timeFormat |= 3;
        return this;
    }
    //#endregion
    //#region 新建样式层属性
    /**
     * 创建一层新的样式，用于格式化下一个传入参数
     */
    get text() {
        const lastLayer = this._lastFormatLayer;
        if (lastLayer.setting.hasUsed)
            this._formatLayer.push({ style: chalk_1.default, template: [], setting: { hasUsed: true } });
        else //如果最后一层还没有用过就不在添加新的了
            lastLayer.setting.hasUsed = true;
        return this;
    }
    /**
     * 消息的标题，text的别名
     */
    get title() {
        return this.text;
    }
    /**
     * 换行
     */
    get linefeed() {
        this.text._lastFormatLayer.text = '\r\n';
        return this._unusedText;
    }
    /**
     * 空格
     */
    get whitespace() {
        this.text._lastFormatLayer.text = ' ';
        return this._unusedText;
    }
    /**
     * 消息的正文，相当于linefeed.text
     */
    get content() {
        return this.linefeed.text;
    }
    /**
     * 代表消息发生的位置。相当于text.square
     */
    get location() {
        return this.text.square;
    }
    //#endregion
    //#region 样式模板
    /**
     * 用方括号包裹要输出的文本内容
     */
    get square() {
        this._getLastFormatLayerAndSetHasUsed.template.push(text => `[${text}]`);
        return this;
    }
    /**
     * 用圆括号包裹要输出的文本内容
     */
    get round() {
        this._getLastFormatLayerAndSetHasUsed.template.push(text => `(${text})`);
        return this;
    }
    /**
     * 用花括号包裹要输出的文本内容
     */
    get mustache() {
        this._getLastFormatLayerAndSetHasUsed.template.push(text => `{${text}}`);
        return this;
    }
    //#endregion
    //#region chalk的方法
    rgb(r, g, b) { return this._invokeChalkFunction('rgb', r, g, b); }
    hsl(h, s, l) { return this._invokeChalkFunction('hsl', h, s, l); }
    hsv(h, s, v) { return this._invokeChalkFunction('hsv', h, s, v); }
    hwb(h, w, b) { return this._invokeChalkFunction('hwb', h, w, b); }
    hex(color) { return this._invokeChalkFunction('hex', color); }
    keyword(color) { return this._invokeChalkFunction('keyword', color); }
    bgRgb(r, g, b) { return this._invokeChalkFunction('bgRgb', r, g, b); }
    bgHsl(h, s, l) { return this._invokeChalkFunction('bgHsl', h, s, l); }
    bgHsv(h, s, v) { return this._invokeChalkFunction('bgHsv', h, s, v); }
    bgHwb(h, w, b) { return this._invokeChalkFunction('bgHwb', h, w, b); }
    bgHex(color) { return this._invokeChalkFunction('bgHex', color); }
    bgKeyword(color) { return this._invokeChalkFunction('bgKeyword', color); }
    //#endregion
    //#region chalk的属性
    get reset() { return this._invokeChalkProperty('reset'); }
    get bold() { return this._invokeChalkProperty('bold'); }
    get dim() { return this._invokeChalkProperty('dim'); }
    get italic() { return this._invokeChalkProperty('italic'); }
    get underline() { return this._invokeChalkProperty('underline'); }
    get inverse() { return this._invokeChalkProperty('inverse'); }
    get hidden() { return this._invokeChalkProperty('hidden'); }
    get strikethrough() { return this._invokeChalkProperty('strikethrough'); }
    get visible() { return this._invokeChalkProperty('visible'); }
    get black() { return this._invokeChalkProperty('black'); }
    get red() { return this._invokeChalkProperty('red'); }
    get green() { return this._invokeChalkProperty('green'); }
    get yellow() { return this._invokeChalkProperty('yellow'); }
    get blue() { return this._invokeChalkProperty('blue'); }
    get magenta() { return this._invokeChalkProperty('magenta'); }
    get cyan() { return this._invokeChalkProperty('cyan'); }
    get white() { return this._invokeChalkProperty('white'); }
    get gray() { return this._invokeChalkProperty('gray'); }
    get grey() { return this._invokeChalkProperty('grey'); }
    get blackBright() { return this._invokeChalkProperty('blackBright'); }
    get redBright() { return this._invokeChalkProperty('redBright'); }
    get greenBright() { return this._invokeChalkProperty('greenBright'); }
    get yellowBright() { return this._invokeChalkProperty('yellowBright'); }
    get blueBright() { return this._invokeChalkProperty('blueBright'); }
    get magentaBright() { return this._invokeChalkProperty('magentaBright'); }
    get cyanBright() { return this._invokeChalkProperty('cyanBright'); }
    get whiteBright() { return this._invokeChalkProperty('whiteBright'); }
    get bgBlack() { return this._invokeChalkProperty('bgBlack'); }
    get bgRed() { return this._invokeChalkProperty('bgRed'); }
    get bgGreen() { return this._invokeChalkProperty('bgGreen'); }
    get bgYellow() { return this._invokeChalkProperty('bgYellow'); }
    get bgBlue() { return this._invokeChalkProperty('bgBlue'); }
    get bgMagenta() { return this._invokeChalkProperty('bgMagenta'); }
    get bgCyan() { return this._invokeChalkProperty('bgCyan'); }
    get bgWhite() { return this._invokeChalkProperty('bgWhite'); }
    get bgBlackBright() { return this._invokeChalkProperty('bgBlackBright'); }
    get bgRedBright() { return this._invokeChalkProperty('bgRedBright'); }
    get bgGreenBright() { return this._invokeChalkProperty('bgGreenBright'); }
    get bgYellowBright() { return this._invokeChalkProperty('bgYellowBright'); }
    get bgBlueBright() { return this._invokeChalkProperty('bgBlueBright'); }
    get bgMagentaBright() { return this._invokeChalkProperty('bgMagentaBright'); }
    get bgCyanBright() { return this._invokeChalkProperty('bgCyanBright'); }
    get bgWhiteBright() { return this._invokeChalkProperty('bgWhiteBright'); }
}
exports.LogFormatter = LogFormatter;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLElBQUksWUFBWSxLQUFXLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxJQUFJLGFBQWEsS0FBVyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FHbkY7QUF6V0Qsb0NBeVdDIiwiZmlsZSI6IkxvZ0Zvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHV0aWwgZnJvbSAndXRpbCc7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgY2hhbGssIHsgQ2hhbGsgfSBmcm9tICdjaGFsayc7XHJcblxyXG5pbXBvcnQgeyBGb3JtYXRMYXllciB9IGZyb20gJy4vRm9ybWF0TGF5ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ0Zvcm1hdHRlciBleHRlbmRzIEZ1bmN0aW9uIHtcclxuXHJcbiAgICAvLyNyZWdpb24g56eB5pyJ5bGe5oCn5LiO5pa55rOVXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKboh6rliqjnvKnov5vlr7nosaHovpPlh7pcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfaW5kZW50SnNvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5L2/55SoY29uc29sZeeahOS9leenjeaWueazleaJk+WNsOWIsOaOp+WItuWPsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9sb2dUeXBlOiAnbG9nJyB8ICdlcnJvcicgfCAnd2FybicgPSAnbG9nJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIOagt+W8j+WxglxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9mb3JtYXRMYXllcjogRm9ybWF0TGF5ZXJbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg5LiA5Liq5pyq5L2/55So5qC35byP5bGCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0IF91bnVzZWRUZXh0KCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX2Zvcm1hdExheWVyLnB1c2goeyBzdHlsZTogY2hhbGssIHRlbXBsYXRlOiBbXSwgc2V0dGluZzogeyBoYXNVc2VkOiBmYWxzZSB9IH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue5pyA5ZCO5LiA5Liq5qC35byP5bGCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0IF9sYXN0Rm9ybWF0TGF5ZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdExheWVyW3RoaXMuX2Zvcm1hdExheWVyLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5pyA5ZCO5LiA5Liq5qC35byP5bGC5bm25bCG5YW26K6+572u5Li65bey57uP5L2/55So6L+H5LqGXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0IF9nZXRMYXN0Rm9ybWF0TGF5ZXJBbmRTZXRIYXNVc2VkKCkge1xyXG4gICAgICAgIGNvbnN0IGxhc3RMYXllciA9IHRoaXMuX2xhc3RGb3JtYXRMYXllcjtcclxuICAgICAgICBsYXN0TGF5ZXIuc2V0dGluZy5oYXNVc2VkID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbGFzdExheWVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8v56ys5LiA5bGC6buY6K6k5piv5pe26Ze0XHJcbiAgICAgICAgdGhpcy5fZm9ybWF0TGF5ZXIucHVzaCh7XHJcbiAgICAgICAgICAgIHN0eWxlOiBjaGFsay5ncmF5LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogW3YgPT4gYFske3Z9XWBdLFxyXG4gICAgICAgICAgICBnZXQgdGV4dCgpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5zZXR0aW5nLnRpbWVGb3JtYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiAvL25vVGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjogLy9ub0RhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudCgpLmZvcm1hdCgnSEg6bW06c3MnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0dGluZzoge1xyXG4gICAgICAgICAgICAgICAgaGFzVXNlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRpbWVGb3JtYXQ6IDAsICAvL+aXpeacn+aYvuekuuagvOW8j1xyXG4gICAgICAgICAgICAgICAgZ2V0IHNraXAoKSB7ICAgIC8v5Yik5pat5piv5ZCm6Lez6L+H5b2T5YmN5bGCXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGltZUZvcm1hdCA+IDI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy/lho3mt7vliqDkuIDlsYLmmK/kuLrkuoborqnnlKjmiLflj6/ku6XlnKjorr7nva7nrKzkuIDkuKrmoLflvI/kuYvliY3lj6/ku6XkuI3osIPnlKh0ZXh0XHJcbiAgICAgICAgdGhpcy5fdW51c2VkVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4uuacgOWQjuS4gOWxguiuvue9ruagt+W8j++8jOiwg+eUqGNoYWxr55qE5pa55rOVXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2ludm9rZUNoYWxrRnVuY3Rpb24obmFtZToga2V5b2YgQ2hhbGssIC4uLmFyZ3M6IGFueVtdKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgbGFzdExheWVyID0gdGhpcy5fZ2V0TGFzdEZvcm1hdExheWVyQW5kU2V0SGFzVXNlZDtcclxuICAgICAgICBsYXN0TGF5ZXIuc3R5bGUgPSAobGFzdExheWVyLnN0eWxlIGFzIGFueSlbbmFtZV0oLi4uYXJncyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuLrmnIDlkI7kuIDlsYLorr7nva7moLflvI/vvIzosIPnlKhjaGFsa+eahOWxnuaAp1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9pbnZva2VDaGFsa1Byb3BlcnR5KG5hbWU6IGtleW9mIENoYWxrKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgbGFzdExheWVyID0gdGhpcy5fZ2V0TGFzdEZvcm1hdExheWVyQW5kU2V0SGFzVXNlZDtcclxuICAgICAgICBsYXN0TGF5ZXIuc3R5bGUgPSAobGFzdExheWVyLnN0eWxlIGFzIGFueSlbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOagvOW8j+WMlui+k+WHulxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC85byP5YyW5Lyg5YWl55qE5Y+C5pWw77yM5L2G5LiN5omT5Y2w5YiwY29uc29sZSAgIFxyXG4gICAgICog5aaC5p6c5qC35byP6ZW/5bqm5aSn5LqO5Y+C5pWw6ZW/5bqm77yM5YiZ5Y+q5bqU55So5a+55bqU6YOo5YiG77yM5Ymp5LiL55qE5qC35byP5b+955Wl44CC5aaC5p6c5Y+C5pWw6ZW/5bqm5aSn5LqO5qC35byP6ZW/5bqm77yM5YiZ5Ymp5LiL55qE5Y+C5pWw5bCG5bqU55So5pyA5ZCO5LiA5Liq5qC35byPXHJcbiAgICAgKi9cclxuICAgIGZvcm1hdCguLi5hcmdzOiBhbnlbXSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHsgc3R5bGU6IGxhc3RMYXllclN0eWxlLCB0ZW1wbGF0ZTogbGFzdExheWVyVGVtcGxhdGUgfSA9IHRoaXMuX2xhc3RGb3JtYXRMYXllcjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgYXJnX2luZGV4ID0gMCwgZm9ybWF0X2luZGV4ID0gMDsgYXJnX2luZGV4IDwgYXJncy5sZW5ndGg7IGZvcm1hdF9pbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmb3JtYXRfaW5kZXggPCB0aGlzLl9mb3JtYXRMYXllci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3R5bGUsIHRlbXBsYXRlLCB0ZXh0LCBzZXR0aW5nIH0gPSB0aGlzLl9mb3JtYXRMYXllcltmb3JtYXRfaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5nLnNraXApIHsgICAgLy/liKTmlq3mmK/lkKbot7Pov4flvZPliY3lsYJcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRfc3RyaW5nOiBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkX3N0cmluZyA9IHRlbXBsYXRlLnJlZHVjZSgocHJlLCB0ZW1wbGF0ZSkgPT4gdGVtcGxhdGUocHJlKSwgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZF9zdHJpbmcgPSB0ZW1wbGF0ZS5yZWR1Y2UoKHByZSwgdGVtcGxhdGUpID0+IHRlbXBsYXRlKHByZSksICh1dGlsIGFzIGFueSAvKiDov5nph4znlLHkuo4gdHNkIOe8uuWkseS6huWumuS5ie+8jOetieW+heeJiOacrOabtOaWsOWQjuWPr+S7peWIoOmZpCAqLykuZm9ybWF0V2l0aE9wdGlvbnMoeyBjb21wYWN0OiAhdGhpcy5faW5kZW50SnNvbiB9LCBhcmdzW2FyZ19pbmRleCsrXSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChzdHlsZSh0cmFuc2Zvcm1lZF9zdHJpbmcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkX3N0cmluZyA9IGxhc3RMYXllclRlbXBsYXRlLnJlZHVjZSgocHJlLCB0ZW1wbGF0ZSkgPT4gdGVtcGxhdGUocHJlKSwgKHV0aWwgYXMgYW55KS5mb3JtYXRXaXRoT3B0aW9ucyh7IGNvbXBhY3Q6ICF0aGlzLl9pbmRlbnRKc29uIH0sIGFyZ3NbYXJnX2luZGV4KytdKSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsYXN0TGF5ZXJTdHlsZSh0cmFuc2Zvcm1lZF9zdHJpbmcpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLzlvI/ljJbkvKDlhaXnmoTlj4LmlbDvvIzlubbmiornu5PmnpzmiZPljbDliLBjb25zb2xlXHJcbiAgICAgKi9cclxuICAgIHByaW50KC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZVt0aGlzLl9sb2dUeXBlXSh0aGlzLmZvcm1hdCguLi5hcmdzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiZPljbDkuIDooYzliIbpmpTnrKbjgILlpoLmnpzmnInlpJrkuKrmoLflvI/ooqvmjIflrprvvIzliJnlj6rmnInnrKzkuIDkuKrkvJrnlJ/mlYjjgILml7bpl7TkuI3kvJrooqvovpPlh7pcclxuICAgICAqIEBwYXJhbSBjaGFyIOWIhumalOespuWtl+esplxyXG4gICAgICogQHBhcmFtIGxlbmd0aCDliIbpmpTnrKbplb/luqbjgILpu5jorqTnrYnkuo7nu4jnq6/nqpflj6Pplb/luqZcclxuICAgICAqL1xyXG4gICAgbGluZShjaGFyOiBzdHJpbmcgPSAnLScsIGxlbmd0aDogbnVtYmVyID0gcHJvY2Vzcy5zdGRvdXQuY29sdW1ucyB8fCA4MCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXMuX2Zvcm1hdExheWVyWzFdO1xyXG4gICAgICAgIGNvbnNvbGVbdGhpcy5fbG9nVHlwZV0oc3R5bGUoY2hhci5yZXBlYXQobGVuZ3RoKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDovpPlh7rnsbvlnovorr7nva5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAmui/h2NvbnNvbGUubG9n6L+b6KGM6L6T5Ye677yM6L+Z5Liq5piv6buY6K6k6YCJ6aG5XHJcbiAgICAgKi9cclxuICAgIGdldCBsb2coKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5fbG9nVHlwZSA9ICdsb2cnO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCa6L+HY29uc29sZS5lcnJvcui/m+ihjOi+k+WHulxyXG4gICAgICovXHJcbiAgICBnZXQgZXJyb3IoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5fbG9nVHlwZSA9ICdlcnJvcic7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgJrov4djb25zb2xlLndhcm7ov5vooYzovpPlh7pcclxuICAgICAqL1xyXG4gICAgZ2V0IHdhcm4oKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5fbG9nVHlwZSA9ICd3YXJuJztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuiHquWKqOe8qei/m+Wvueixoei+k+WHulxyXG4gICAgICovXHJcbiAgICBnZXQgaW5kZW50SnNvbigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl9pbmRlbnRKc29uID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5pe26Ze05qC85byP6K6+572uXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuI3mmL7npLrml7bpl7RcclxuICAgICAqL1xyXG4gICAgZ2V0IG5vVGltZSgpOiB0aGlzIHtcclxuICAgICAgICAodGhpcy5fZm9ybWF0TGF5ZXJbMF0uc2V0dGluZy50aW1lRm9ybWF0IGFzIG51bWJlcikgfD0gMTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4jeaYvuekuuaXpeacn1xyXG4gICAgICovXHJcbiAgICBnZXQgbm9EYXRlKCk6IHRoaXMge1xyXG4gICAgICAgICh0aGlzLl9mb3JtYXRMYXllclswXS5zZXR0aW5nLnRpbWVGb3JtYXQgYXMgbnVtYmVyKSB8PSAyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LiN5pi+56S65pel5pyf5LiO5pe26Ze0XHJcbiAgICAgKi9cclxuICAgIGdldCBub0RhdGV0aW1lKCk6IHRoaXMge1xyXG4gICAgICAgICh0aGlzLl9mb3JtYXRMYXllclswXS5zZXR0aW5nLnRpbWVGb3JtYXQgYXMgbnVtYmVyKSB8PSAzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDmlrDlu7rmoLflvI/lsYLlsZ7mgKdcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4gOWxguaWsOeahOagt+W8j++8jOeUqOS6juagvOW8j+WMluS4i+S4gOS4quS8oOWFpeWPguaVsFxyXG4gICAgICovXHJcbiAgICBnZXQgdGV4dCgpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBsYXN0TGF5ZXIgPSB0aGlzLl9sYXN0Rm9ybWF0TGF5ZXI7XHJcbiAgICAgICAgaWYgKGxhc3RMYXllci5zZXR0aW5nLmhhc1VzZWQpXHJcbiAgICAgICAgICAgIHRoaXMuX2Zvcm1hdExheWVyLnB1c2goeyBzdHlsZTogY2hhbGssIHRlbXBsYXRlOiBbXSwgc2V0dGluZzogeyBoYXNVc2VkOiB0cnVlIH0gfSk7XHJcbiAgICAgICAgZWxzZSAgICAvL+WmguaenOacgOWQjuS4gOWxgui/mOayoeacieeUqOi/h+WwseS4jeWcqOa3u+WKoOaWsOeahOS6hlxyXG4gICAgICAgICAgICBsYXN0TGF5ZXIuc2V0dGluZy5oYXNVc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmtojmga/nmoTmoIfpopjvvIx0ZXh055qE5Yir5ZCNXHJcbiAgICAgKi9cclxuICAgIGdldCB0aXRsZSgpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5o2i6KGMXHJcbiAgICAgKi9cclxuICAgIGdldCBsaW5lZmVlZCgpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnRleHQuX2xhc3RGb3JtYXRMYXllci50ZXh0ID0gJ1xcclxcbic7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VudXNlZFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnqbrmoLxcclxuICAgICAqL1xyXG4gICAgZ2V0IHdoaXRlc3BhY2UoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy50ZXh0Ll9sYXN0Rm9ybWF0TGF5ZXIudGV4dCA9ICcgJztcclxuICAgICAgICByZXR1cm4gdGhpcy5fdW51c2VkVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa2iOaBr+eahOato+aWh++8jOebuOW9k+S6jmxpbmVmZWVkLnRleHRcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRlbnQoKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGluZWZlZWQudGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS7o+ihqOa2iOaBr+WPkeeUn+eahOS9jee9ruOAguebuOW9k+S6jnRleHQuc3F1YXJlXHJcbiAgICAgKi9cclxuICAgIGdldCBsb2NhdGlvbigpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0LnNxdWFyZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5qC35byP5qih5p2/XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjmlrnmi6zlj7fljIXoo7nopoHovpPlh7rnmoTmlofmnKzlhoXlrrlcclxuICAgICAqL1xyXG4gICAgZ2V0IHNxdWFyZSgpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl9nZXRMYXN0Rm9ybWF0TGF5ZXJBbmRTZXRIYXNVc2VkLnRlbXBsYXRlLnB1c2godGV4dCA9PiBgWyR7dGV4dH1dYCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjlnIbmi6zlj7fljIXoo7nopoHovpPlh7rnmoTmlofmnKzlhoXlrrlcclxuICAgICAqL1xyXG4gICAgZ2V0IHJvdW5kKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX2dldExhc3RGb3JtYXRMYXllckFuZFNldEhhc1VzZWQudGVtcGxhdGUucHVzaCh0ZXh0ID0+IGAoJHt0ZXh0fSlgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUqOiKseaLrOWPt+WMheijueimgei+k+WHuueahOaWh+acrOWGheWuuVxyXG4gICAgICovXHJcbiAgICBnZXQgbXVzdGFjaGUoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5fZ2V0TGFzdEZvcm1hdExheWVyQW5kU2V0SGFzVXNlZC50ZW1wbGF0ZS5wdXNoKHRleHQgPT4gYHske3RleHR9fWApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBjaGFsa+eahOaWueazlVxyXG5cclxuICAgIHJnYihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdyZ2InLCByLCBnLCBiKTsgfVxyXG4gICAgaHNsKGg6IG51bWJlciwgczogbnVtYmVyLCBsOiBudW1iZXIpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrRnVuY3Rpb24oJ2hzbCcsIGgsIHMsIGwpOyB9XHJcbiAgICBoc3YoaDogbnVtYmVyLCBzOiBudW1iZXIsIHY6IG51bWJlcik6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtGdW5jdGlvbignaHN2JywgaCwgcywgdik7IH1cclxuICAgIGh3YihoOiBudW1iZXIsIHc6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdod2InLCBoLCB3LCBiKTsgfVxyXG4gICAgaGV4KGNvbG9yOiBzdHJpbmcpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrRnVuY3Rpb24oJ2hleCcsIGNvbG9yKTsgfVxyXG4gICAga2V5d29yZChjb2xvcjogc3RyaW5nKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdrZXl3b3JkJywgY29sb3IpOyB9XHJcbiAgICBiZ1JnYihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdiZ1JnYicsIHIsIGcsIGIpOyB9XHJcbiAgICBiZ0hzbChoOiBudW1iZXIsIHM6IG51bWJlciwgbDogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdiZ0hzbCcsIGgsIHMsIGwpOyB9XHJcbiAgICBiZ0hzdihoOiBudW1iZXIsIHM6IG51bWJlciwgdjogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdiZ0hzdicsIGgsIHMsIHYpOyB9XHJcbiAgICBiZ0h3YihoOiBudW1iZXIsIHc6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdiZ0h3YicsIGgsIHcsIGIpOyB9XHJcbiAgICBiZ0hleChjb2xvcjogc3RyaW5nKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa0Z1bmN0aW9uKCdiZ0hleCcsIGNvbG9yKTsgfVxyXG4gICAgYmdLZXl3b3JkKGNvbG9yOiBzdHJpbmcpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrRnVuY3Rpb24oJ2JnS2V5d29yZCcsIGNvbG9yKTsgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBjaGFsa+eahOWxnuaAp1xyXG5cclxuICAgIGdldCByZXNldCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ3Jlc2V0Jyk7IH1cclxuICAgIGdldCBib2xkKCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYm9sZCcpOyB9XHJcbiAgICBnZXQgZGltKCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnZGltJyk7IH1cclxuICAgIGdldCBpdGFsaWMoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdpdGFsaWMnKTsgfVxyXG4gICAgZ2V0IHVuZGVybGluZSgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ3VuZGVybGluZScpOyB9XHJcbiAgICBnZXQgaW52ZXJzZSgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2ludmVyc2UnKTsgfVxyXG4gICAgZ2V0IGhpZGRlbigpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2hpZGRlbicpOyB9XHJcbiAgICBnZXQgc3RyaWtldGhyb3VnaCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ3N0cmlrZXRocm91Z2gnKTsgfVxyXG5cclxuICAgIGdldCB2aXNpYmxlKCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgndmlzaWJsZScpOyB9XHJcblxyXG4gICAgZ2V0IGJsYWNrKCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYmxhY2snKTsgfVxyXG4gICAgZ2V0IHJlZCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ3JlZCcpOyB9XHJcbiAgICBnZXQgZ3JlZW4oKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdncmVlbicpOyB9XHJcbiAgICBnZXQgeWVsbG93KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgneWVsbG93Jyk7IH1cclxuICAgIGdldCBibHVlKCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYmx1ZScpOyB9XHJcbiAgICBnZXQgbWFnZW50YSgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ21hZ2VudGEnKTsgfVxyXG4gICAgZ2V0IGN5YW4oKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdjeWFuJyk7IH1cclxuICAgIGdldCB3aGl0ZSgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ3doaXRlJyk7IH1cclxuICAgIGdldCBncmF5KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnZ3JheScpOyB9XHJcbiAgICBnZXQgZ3JleSgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2dyZXknKTsgfVxyXG4gICAgXHJcbiAgICBnZXQgYmxhY2tCcmlnaHQoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdibGFja0JyaWdodCcpOyB9XHJcbiAgICBnZXQgcmVkQnJpZ2h0KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgncmVkQnJpZ2h0Jyk7IH1cclxuICAgIGdldCBncmVlbkJyaWdodCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2dyZWVuQnJpZ2h0Jyk7IH1cclxuICAgIGdldCB5ZWxsb3dCcmlnaHQoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCd5ZWxsb3dCcmlnaHQnKTsgfVxyXG4gICAgZ2V0IGJsdWVCcmlnaHQoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdibHVlQnJpZ2h0Jyk7IH1cclxuICAgIGdldCBtYWdlbnRhQnJpZ2h0KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnbWFnZW50YUJyaWdodCcpOyB9XHJcbiAgICBnZXQgY3lhbkJyaWdodCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2N5YW5CcmlnaHQnKTsgfVxyXG4gICAgZ2V0IHdoaXRlQnJpZ2h0KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnd2hpdGVCcmlnaHQnKTsgfVxyXG5cclxuICAgIGdldCBiZ0JsYWNrKCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYmdCbGFjaycpOyB9XHJcbiAgICBnZXQgYmdSZWQoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdiZ1JlZCcpOyB9XHJcbiAgICBnZXQgYmdHcmVlbigpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2JnR3JlZW4nKTsgfVxyXG4gICAgZ2V0IGJnWWVsbG93KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYmdZZWxsb3cnKTsgfVxyXG4gICAgZ2V0IGJnQmx1ZSgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2JnQmx1ZScpOyB9XHJcbiAgICBnZXQgYmdNYWdlbnRhKCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYmdNYWdlbnRhJyk7IH1cclxuICAgIGdldCBiZ0N5YW4oKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdiZ0N5YW4nKTsgfVxyXG4gICAgZ2V0IGJnV2hpdGUoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdiZ1doaXRlJyk7IH1cclxuICAgIFxyXG4gICAgZ2V0IGJnQmxhY2tCcmlnaHQoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdiZ0JsYWNrQnJpZ2h0Jyk7IH1cclxuICAgIGdldCBiZ1JlZEJyaWdodCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2JnUmVkQnJpZ2h0Jyk7IH1cclxuICAgIGdldCBiZ0dyZWVuQnJpZ2h0KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYmdHcmVlbkJyaWdodCcpOyB9XHJcbiAgICBnZXQgYmdZZWxsb3dCcmlnaHQoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdiZ1llbGxvd0JyaWdodCcpOyB9XHJcbiAgICBnZXQgYmdCbHVlQnJpZ2h0KCk6IHRoaXMgeyByZXR1cm4gdGhpcy5faW52b2tlQ2hhbGtQcm9wZXJ0eSgnYmdCbHVlQnJpZ2h0Jyk7IH1cclxuICAgIGdldCBiZ01hZ2VudGFCcmlnaHQoKTogdGhpcyB7IHJldHVybiB0aGlzLl9pbnZva2VDaGFsa1Byb3BlcnR5KCdiZ01hZ2VudGFCcmlnaHQnKTsgfVxyXG4gICAgZ2V0IGJnQ3lhbkJyaWdodCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2JnQ3lhbkJyaWdodCcpOyB9XHJcbiAgICBnZXQgYmdXaGl0ZUJyaWdodCgpOiB0aGlzIHsgcmV0dXJuIHRoaXMuX2ludm9rZUNoYWxrUHJvcGVydHkoJ2JnV2hpdGVCcmlnaHQnKTsgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59Il19
