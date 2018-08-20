export declare class LogFormatter extends Function {
    /**
     * 是否自动缩进对象输出
     */
    private _indentJson;
    /**
     * 使用console的何种方法打印到控制台
     */
    private _logType;
    /**
     * 样式层
     */
    private _formatLayer;
    /**
     * 添加一个未使用样式层
     */
    private readonly _unusedText;
    /**
     * 返回最后一个样式层
     */
    private readonly _lastFormatLayer;
    /**
     * 获取最后一个样式层并将其设置为已经使用过了
     */
    private readonly _getLastFormatLayerAndSetHasUsed;
    constructor();
    /**
     * 为最后一层设置样式，调用chalk的方法
     */
    private _invokeChalkFunction;
    /**
     * 为最后一层设置样式，调用chalk的属性
     */
    private _invokeChalkProperty;
    /**
     * 格式化传入的参数，但不打印到console
     * 如果样式长度大于参数长度，则只应用对应部分，剩下的样式忽略。如果参数长度大于样式长度，则剩下的参数将应用最后一个样式
     */
    format(...args: any[]): string;
    /**
     * 格式化传入的参数，并把结果打印到console
     */
    print(...args: any[]): void;
    /**
     * 打印一行分隔符。如果有多个样式被指定，则只有第一个会生效。时间不会被输出
     * @param char 分隔符字符
     * @param length 分隔符长度。默认等于终端窗口长度
     */
    line(char?: string, length?: number): void;
    /**
     * 通过console.log进行输出，这个是默认选项
     */
    readonly log: this;
    /**
     * 通过console.error进行输出
     */
    readonly error: this;
    /**
     * 通过console.warn进行输出
     */
    readonly warn: this;
    /**
     * 是否自动缩进对象输出
     */
    readonly indentJson: this;
    /**
     * 不显示时间
     */
    readonly noTime: this;
    /**
     * 不显示日期
     */
    readonly noDate: this;
    /**
     * 不显示日期与时间
     */
    readonly noDatetime: this;
    /**
     * 创建一层新的样式，用于格式化下一个传入参数
     */
    readonly text: this;
    /**
     * 消息的标题，text的别名
     */
    readonly title: this;
    /**
     * 换行
     */
    readonly linefeed: this;
    /**
     * 空格
     */
    readonly whitespace: this;
    /**
     * 消息的正文，相当于linefeed.text
     */
    readonly content: this;
    /**
     * 代表消息发生的位置。相当于text.square
     */
    readonly location: this;
    /**
     * 用方括号包裹要输出的文本内容
     */
    readonly square: this;
    /**
     * 用圆括号包裹要输出的文本内容
     */
    readonly round: this;
    /**
     * 用花括号包裹要输出的文本内容
     */
    readonly mustache: this;
    rgb(r: number, g: number, b: number): this;
    hsl(h: number, s: number, l: number): this;
    hsv(h: number, s: number, v: number): this;
    hwb(h: number, w: number, b: number): this;
    hex(color: string): this;
    keyword(color: string): this;
    bgRgb(r: number, g: number, b: number): this;
    bgHsl(h: number, s: number, l: number): this;
    bgHsv(h: number, s: number, v: number): this;
    bgHwb(h: number, w: number, b: number): this;
    bgHex(color: string): this;
    bgKeyword(color: string): this;
    readonly reset: this;
    readonly bold: this;
    readonly dim: this;
    readonly italic: this;
    readonly underline: this;
    readonly inverse: this;
    readonly hidden: this;
    readonly strikethrough: this;
    readonly visible: this;
    readonly black: this;
    readonly red: this;
    readonly green: this;
    readonly yellow: this;
    readonly blue: this;
    readonly magenta: this;
    readonly cyan: this;
    readonly white: this;
    readonly gray: this;
    readonly grey: this;
    readonly blackBright: this;
    readonly redBright: this;
    readonly greenBright: this;
    readonly yellowBright: this;
    readonly blueBright: this;
    readonly magentaBright: this;
    readonly cyanBright: this;
    readonly whiteBright: this;
    readonly bgBlack: this;
    readonly bgRed: this;
    readonly bgGreen: this;
    readonly bgYellow: this;
    readonly bgBlue: this;
    readonly bgMagenta: this;
    readonly bgCyan: this;
    readonly bgWhite: this;
    readonly bgBlackBright: this;
    readonly bgRedBright: this;
    readonly bgGreenBright: this;
    readonly bgYellowBright: this;
    readonly bgBlueBright: this;
    readonly bgMagentaBright: this;
    readonly bgCyanBright: this;
    readonly bgWhiteBright: this;
}
//# sourceMappingURL=LogFormatter.d.ts.map