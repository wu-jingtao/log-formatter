import { LogFormatter } from './LogFormatter';

export interface ILogFormatterProxy extends LogFormatter {
    (...args: any[]): void;
}
