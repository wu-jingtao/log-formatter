import { Logger } from './Logger';
import { LoggerPublicProperties } from './LoggerPublicProperties';

/**
 * 用于标准化命令行输出的格式
 */
const log: LoggerPublicProperties = new Proxy({}, {
    get() {
        return (new Logger).toProxy();
    },
    apply(target, thisArg, argumentsList) {
        (new Logger).log(...argumentsList)
    }
}) as any;

export default log