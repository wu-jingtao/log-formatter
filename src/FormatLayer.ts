import { Chalk } from 'chalk';

/**
 * 样式层
 */
export interface IFormatLayer {
    style: Chalk;

    /**
     * 在字符串被Chalk格式化之前，对文本内容进行修改
     */
    template: ((value: string) => string)[];

    /**
     * 如果设置了text，则该层将使用text作为文本输出，不消耗一个参数
     */
    text?: string;

    setting: {
        /**
         * 判断该层是否被使用过
         */
        hasUsed: boolean;

        /**
         * 在format样式的时候是否跳过该层，默认false
         */
        skip?: boolean;

        /**
         * 日期显示格式，这个主要是给第一层格式化时间使用的
         */
        timeFormat?: number;
    };
}
