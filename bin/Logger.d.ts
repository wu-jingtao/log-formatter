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
     */
    private _type;
    /**
     * 样式层数组
     */
    private readonly _formatArray;
    constructor();
    /**
     * 创建新的样式层。
     *
     * @private
     * @returns {FormatLayer} 返回新创建的层
     * @memberof Logger
     */
    private _newLayer();
    /**
     * 返回当前层
     *
     * @private
     * @memberof Logger
     */
    private _currentLayer();
    /**
     * 为当前层添加新的样式
     *
     * @private
     * @param {keyof _chalk.ChalkStyleMap} style chalk 样式的名称
     * @memberof Logger
     */
    private _addStyle(style);
    /**
     * 为当前层添加新的样式模板
     *
     * @private
     * @param {(arg: string) => string} template 样式模板
     * @memberof Logger
     */
    private _addTemplate(template);
    format(...text: any[]): any[];
    /**
     * 将格式化后的内容打印到控制台
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
