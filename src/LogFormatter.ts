/**
 * 输出格式化器
 */
export default interface LogFormatter {
    // #region 设置输出类型

    /**
     * 通过 console.log 进行输出（默认选项）
     */
    readonly log: this;
    /**
     * 通过 console.error 进行输出
     */
    readonly error: this;
    /**
     * 通过 console.warn 进行输出
     */
    readonly warn: this;
    /**
     * 通过 console.info 进行输出
     */
    readonly info: this;

    // #endregion

    // #region 设置 chalk 颜色等级

    /**
     * 关闭所有颜色（默认根据环境自动设置）
     */
    readonly level1: this;
    /**
     * 基本 16 色（默认根据环境自动设置）
     */
    readonly level2: this;
    /**
     * ANSI 256 色（默认根据环境自动设置）
     */
    readonly level3: this;
    /**
     * 真彩色 1600 万色（默认根据环境自动设置）
     */
    readonly level4: this;

    // #endregion

    // #region 设置时间日期

    /**
     * 在输出的最前面显示时间
     */
    readonly time: this;
    /**
     * 在输出的最前面显示日期
     */
    readonly date: this;
    /**
     * 在输出的最前面显示时间和日期
     */
    readonly dateTime: this;

    // #endregion

    // #region 设置输出格式

    /**
     * 用方括号包裹要输出的内容
     */
    readonly square: this;
    /**
     * 用圆括号包裹要输出的内容
     */
    readonly round: this;
    /**
     * 用花括号包裹要输出的内容
     */
    readonly mustache: this;
    /**
     * 自动缩进对象输出
     */
    readonly indentJson: this;
    /**
     * 重置当前样式
     */
    readonly reset: this;

    // #endregion

    // #region 插入符号

    /**
     * 向后插入换行符
     */
    readonly linebreak: this;
    /**
     * 向前插入换行符
     */
    readonly newline: this;
    /**
     * 向后插入空格
     */
    readonly whitespace: this;
    /**
     * 向后插入冒号
     */
    readonly colon: this;
    /**
     * 向后插入横线，连字符
     */
    readonly hyphen: this;
    /**
     * 向后插入竖线
     */
    readonly verticalBar: this;
    /**
     * 打印一行分隔符
     * @param char 分隔符，默认 '-'
     * @param length 打印长度，默认 80
     */
    line: (char?: string, length?: number) => this;

    // #endregion

    // #region 占位符

    /**
     * 占位符
     */
    readonly text: this;
    /**
     * 位置，等同于 text.square
     */
    readonly location: this;
    /**
     * 标题，等同于 text.bold.linebreak
     */
    readonly title: this;
    /**
     * 段落，等同于 text.linebreak
     */
    readonly paragraph: this;
    /**
     * 章节，等同于 text.newline.linebreak
     */
    readonly section: this;

    // #endregion

    // #region 打印输出

    /**
     * 格式化传入的参数，并把结果打印到 console
     */
    (...data: unknown[]): void;
    /**
     * 格式化传入的参数，并把结果打印到 console
     */
    print: (...args: unknown[]) => void;
    /**
     * 格式化传入的参数，返回格式化后的字符串数组
     */
    format: (...args: unknown[]) => string[];

    // #endregion

    // #region chalk 样式

    /**
     * 使文本加粗
     */
    readonly bold: this;
    /**
     * 降低文本的不透明度
     */
    readonly dim: this;
    /**
     * 将文本设为斜体（未得到广泛支持）
     */
    readonly italic: this;
    /**
     * 在文本下方放置一条水平线（未得到广泛支持）
     */
    readonly underline: this;
    /**
     * 在文本上方添加一条水平线（未得到广泛支持）
     */
    readonly overline: this;
    /**
     * 反转背景色和前景色
     */
    readonly inverse: this;
    /**
     * 打印文本但不可见
     */
    readonly hidden: this;
    /**
     * 在文本中心放置一条水平线（未得到广泛支持）
     */
    readonly strikethrough: this;
    /**
     * 仅当 Chalk 的颜色级别高于零时才打印文本，对于纯装饰性的东西很有用
     */
    readonly visible: this;
    /**
     * 黑色
     */
    readonly black: this;
    /**
     * 红色
     */
    readonly red: this;
    /**
     * 绿色
     */
    readonly green: this;
    /**
     * 黄色
     */
    readonly yellow: this;
    /**
     * 蓝色
     */
    readonly blue: this;
    /**
     * 洋红色
     */
    readonly magenta: this;
    /**
     * 蓝绿色
     */
    readonly cyan: this;
    /**
     * 白色
     */
    readonly white: this;
    /**
     * 灰色
     */
    readonly gray: this;
    /**
     * 灰色
     */
    readonly grey: this;
    /**
     * 黑色明亮（灰色）
     */
    readonly blackBright: this;
    /**
     * 红色明亮
     */
    readonly redBright: this;
    /**
     * 绿色明亮
     */
    readonly greenBright: this;
    /**
     * 黄色明亮
     */
    readonly yellowBright: this;
    /**
     * 蓝色明亮
     */
    readonly blueBright: this;
    /**
     * 洋红色明亮
     */
    readonly magentaBright: this;
    /**
     * 蓝绿色明亮
     */
    readonly cyanBright: this;
    /**
     * 白色明亮
     */
    readonly whiteBright: this;
    /**
     * 背景黑色
     */
    readonly bgBlack: this;
    /**
     * 背景红色
     */
    readonly bgRed: this;
    /**
     * 背景绿色
     */
    readonly bgGreen: this;
    /**
     * 背景黄色
     */
    readonly bgYellow: this;
    /**
     * 背景蓝色
     */
    readonly bgBlue: this;
    /**
     * 背景洋红色
     */
    readonly bgMagenta: this;
    /**
     * 背景蓝绿色
     */
    readonly bgCyan: this;
    /**
     * 背景白色
     */
    readonly bgWhite: this;
    /**
     * 背景灰色
     */
    readonly bgGray: this;
    /**
     * 背景黑色明亮（灰色）
     */
    readonly bgBlackBright: this;
    /**
     * 背景红色明亮
     */
    readonly bgRedBright: this;
    /**
     * 背景绿色明亮
     */
    readonly bgGreenBright: this;
    /**
     * 背景黄色明亮
     */
    readonly bgYellowBright: this;
    /**
     * 背景蓝色明亮
     */
    readonly bgBlueBright: this;
    /**
     * 背景洋红色明亮
     */
    readonly bgMagentaBright: this;
    /**
     * 背景蓝绿色明亮
     */
    readonly bgCyanBright: this;
    /**
     * 背景白色明亮
     */
    readonly bgWhiteBright: this;
    /**
     * 使用 RGB 值设置文本颜色
     * @example log.rgb(222, 173, 237)
     */
    rgb: (r: number, g: number, b: number) => this;
    /**
     * 使用 HEX 值设置文本颜色
     * @example log.hex('#DEADED')
     */
    hex: (color: string) => this;
    /**
     * 使用 [8-bit 无符号整数](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) 值设置文本颜色
     * @example log.ansi256(201)
     */
    ansi256: (index: number) => this;
    /**
     * 使用 RGB 值设置背景颜色
     * @example log.bgRgb(222, 173, 237)
     */
    bgRgb: (r: number, g: number, b: number) => this;
    /**
     * 使用 HEX 值设置背景颜色
     * @example log.bgHex('#DEADED')
     */
    bgHex: (color: string) => this;
    /**
     * 使用 [8-bit 无符号整数](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) 值设置背景颜色
     * @example log.bgAnsi256(201)
     */
    bgAnsi256: (index: number) => this;

    // #endregion
}
