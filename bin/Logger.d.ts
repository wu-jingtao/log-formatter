import { LoggerPublicProperties } from './LoggerPublicProperties';
/**
 * 消息模板的构造类
 *
 * @export
 * @class Logger
 */
export declare class Logger extends Function {
    /**
     * 日志类型
     *
     * @private
     * @memberof Logger
     */
    private _type;
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
    private readonly _formatArray;
    /**
     * 输出格式化后的字符串
     *
     * @param {...any[]} text 要被格式化的内容
     * @returns {string}
     * @memberof Logger
     */
    toString(...text: any[]): string;
    /**
     * 将格式化后的文本打印到控制台
     *
     * @param {...any[]} text 要被格式化的内容
     * @memberof Logger
     */
    log(...text: any[]): void;
    /**
     * 包装当前对象
     *
     * @returns {LoggerPublicProperties}
     * @memberof Logger
     */
    toProxy(): LoggerPublicProperties;
}
