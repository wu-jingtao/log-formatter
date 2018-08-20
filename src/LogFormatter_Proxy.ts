import { LogFormatter } from "./LogFormatter";

export interface LogFormatter_Proxy extends LogFormatter {
    (...args: any[]): void;
}