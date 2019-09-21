import { ILogFormatterProxy } from './ILogFormatterProxy';
import { LogFormatter } from './LogFormatter';

const logFormatter = new Proxy(new LogFormatter(), {
    get(target, property) {
        const logger: any = new Proxy(new LogFormatter(), {
            apply(target, thisArg, argArray) {
                target.print(...argArray);
            }
        });

        return logger[property];
    },
    apply(target, thisArg, argArray) {
        target.print(...argArray);
    }
}) as ILogFormatterProxy;

export default logFormatter;
