import { LogFormatter } from './LogFormatter';

export interface LogFormatterProxy extends LogFormatter {
    (...args: any[]): void;
}
