import { LogFormatter } from "./LogFormatter";
import { LogFormatter_Proxy } from "./LogFormatter_Proxy";

const __LogFormatter_Proxy = new Proxy(new LogFormatter, {
    get(target, property) {
        const logger: any = new Proxy(new LogFormatter, {
            apply(target, thisArg, argArray) {
                target.print(...argArray);
            }
        });

        return logger[property];
    },
    apply(target, thisArg, argArray) {
        target.print(...argArray);
    }
}) as LogFormatter_Proxy;

export default __LogFormatter_Proxy;