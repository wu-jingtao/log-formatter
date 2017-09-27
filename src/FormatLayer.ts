import * as chalk from 'chalk';

/**
 * 样式层
 * 
 * @export
 * @interface FormatLayer
 */
export interface FormatLayer {
    /**
     * chalk方法  
     * 
     * @type {chalk.ChalkChain}
     * @memberof FormatLayer
     */
    style?: chalk.ChalkChain;

    /**
     * 默认的文本。被style样式化后传入template进一步处理  
     * 
     * @type {string}
     * @memberof FormatLayer
     */
    text?: string;

    /**
     * 模板。多个模板可以相互嵌套，最先添加的最先应用
     * 
     * @memberof FormatLayer
     */
    template: ((arg: string) => string)[];

    /**
     * 内部使用，对当前层提供一些额外的描述信息
     * 
     * @type {any}
     * @memberof FormatLayer
     */
    tag?: any;

    /**
     * 是否跳过这一层
     * 
     * @type {boolean}
     * @memberof FormatLayer
     */
    skip?: boolean;
}