import { Logger } from './Logger';
import { LoggerPublicProperties } from './LoggerPublicProperties';

/**
 * 用于标准化命令行输出的格式
 */
const log: LoggerPublicProperties = new Proxy(function () { }, {
    get(target, property: keyof LoggerPublicProperties) {
        return (new Logger).toProxy()[property];
    },
    apply(target, thisArg, argumentsList) {
        (new Logger).log(...argumentsList)
    }
}) as any;

export default log;