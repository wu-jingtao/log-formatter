import moment from 'moment';
import { Chalk, type ChalkInstance } from 'chalk';
import type LogFormatter from './LogFormatter';

/**
 * 格式化层
 */
interface FormatLayer {
    /**
     * 着色器
     */
    chalk: ChalkInstance;
    /**
     * 文本加工函数列表
     */
    processor: ((text: string) => string)[];
    /**
     * 内部，文本生成器
     */
    internalProcessor?: () => string;
    /**
     * 是否缩进对象输出
     */
    indentJson?: boolean;
}

export default new Proxy(console.log, {
    get(target, property: keyof LogFormatter, receiver) {
        const layers: FormatLayer[] = [];
        let currentLayer: FormatLayer | undefined;
        let functionCall: 'line' | 'print' | 'format' | 'rgb' | 'hex' | 'ansi256' | 'bgRgb' | 'bgHex' | 'bgAnsi256' | undefined;
        let logType: 'log' | 'error' | 'warn' | 'info' = 'log';

        function createLayer(prepend?: boolean): FormatLayer {
            currentLayer = { chalk: new Chalk(), processor: [] };
            prepend ? layers.unshift(currentLayer) : layers.push(currentLayer);
            return currentLayer;
        }

        const proxy: LogFormatter = new Proxy<any>(function LogFormatter() { /* Proxy 被代理对象 */ }, {
            get(target, property: keyof LogFormatter, receiver) {
                // 清除上一次方法调用名称
                functionCall = undefined;

                // 设置输出类型
                if (property === 'log') { logType = 'log'; return proxy }
                if (property === 'error') { logType = 'error'; return proxy }
                if (property === 'warn') { logType = 'warn'; return proxy }
                if (property === 'info') { logType = 'info'; return proxy }

                // 设置时间日期
                if (property === 'time') {
                    createLayer(true).internalProcessor = () => moment().format('HH:mm:ss');
                    return proxy.square.gray;
                }
                if (property === 'date') {
                    createLayer(true).internalProcessor = () => moment().format('YYYY-MM-DD');
                    return proxy.square.gray;
                }
                if (property === 'dateTime') {
                    createLayer(true).internalProcessor = () => moment().format('YYYY-MM-DD HH:mm:ss');
                    return proxy.square.gray;
                }

                // 占位符
                if (property === 'text') { createLayer(); return proxy }
                if (property === 'title') { return proxy.text.bold.linebreak }
                if (property === 'location') { return proxy.text.square }
                if (property === 'paragraph') { return proxy.text.linebreak }
                if (property === 'section') { return proxy.text.newline.linebreak }

                // 打印一行分隔符
                if (property === 'line') { functionCall = property; return proxy }

                // 检查是否已经创建 layer（注意有些属性不能放在这行代码之后，避免重复创建空层）
                currentLayer ??= createLayer();

                switch (property) {
                    // 设置 chalk 颜色等级
                    case 'level1': { currentLayer.chalk.level = 0; break }
                    case 'level2': { currentLayer.chalk.level = 1; break }
                    case 'level3': { currentLayer.chalk.level = 2; break }
                    case 'level4': { currentLayer.chalk.level = 3; break }

                    // 设置输出格式
                    case 'square': { currentLayer.processor.push(text => `[${text}]`); break }
                    case 'round': { currentLayer.processor.push(text => `(${text})`); break }
                    case 'mustache': { currentLayer.processor.push(text => `{${text}}`); break }
                    case 'indentJson': { currentLayer.indentJson = true; break }
                    case 'reset': {
                        currentLayer.chalk = new Chalk();
                        currentLayer.processor = [];
                        currentLayer.indentJson = false;
                        break;
                    }

                    // 插入符号
                    case 'linebreak': { currentLayer.processor.push(text => text + '\r\n'); break }
                    case 'newline': { currentLayer.processor.push(text => '\r\n' + text); break }
                    case 'whitespace': { currentLayer.processor.push(text => text + '   '); break }
                    case 'colon': { currentLayer.processor.push(text => text + ' : '); break }
                    case 'hyphen': { currentLayer.processor.push(text => text + ' - '); break }
                    case 'verticalBar': { currentLayer.processor.push(text => text + ' | '); break }

                    // chalk 样式
                    case 'bold':
                    case 'dim':
                    case 'italic':
                    case 'underline':
                    case 'overline':
                    case 'inverse':
                    case 'hidden':
                    case 'strikethrough':
                    case 'visible':
                    case 'black':
                    case 'red':
                    case 'green':
                    case 'yellow':
                    case 'blue':
                    case 'magenta':
                    case 'cyan':
                    case 'white':
                    case 'gray':
                    case 'grey':
                    case 'blackBright':
                    case 'redBright':
                    case 'greenBright':
                    case 'yellowBright':
                    case 'blueBright':
                    case 'magentaBright':
                    case 'cyanBright':
                    case 'whiteBright':
                    case 'bgBlack':
                    case 'bgRed':
                    case 'bgGreen':
                    case 'bgYellow':
                    case 'bgBlue':
                    case 'bgMagenta':
                    case 'bgCyan':
                    case 'bgWhite':
                    case 'bgGray':
                    case 'bgBlackBright':
                    case 'bgRedBright':
                    case 'bgGreenBright':
                    case 'bgYellowBright':
                    case 'bgBlueBright':
                    case 'bgMagentaBright':
                    case 'bgCyanBright':
                    case 'bgWhiteBright': {
                        currentLayer.chalk = currentLayer.chalk[property];
                        break;
                    }

                    // 方法调用
                    case 'print':
                    case 'format':
                    case 'rgb':
                    case 'hex':
                    case 'ansi256':
                    case 'bgRgb':
                    case 'bgHex':
                    case 'bgAnsi256': {
                        functionCall = property;
                        break;
                    }

                    // 访问异常
                    default: {
                        throw new TypeError(`Cannot read properties of LogFormatter (reading '${property as string}')`);
                    }
                }

                return proxy;
            },
            apply(target, thisArg, argumentsList) {
                switch (functionCall) {
                    case 'rgb':
                    case 'hex':
                    case 'ansi256':
                    case 'bgRgb':
                    case 'bgHex':
                    case 'bgAnsi256': {
                        currentLayer!.chalk = (currentLayer!.chalk[functionCall] as Function)(...argumentsList);
                        return proxy;
                    }
                    case 'line': {
                        const [char = '-', length = 80] = argumentsList as [string, number];
                        const text = char.repeat(length);
                        createLayer().internalProcessor = () => text;
                        return proxy.newline.linebreak;
                    }
                    case 'format': {
                        const result: unknown[] = [];
                        let layerIndex = 0, argIndex = 0;

                        while (layerIndex < layers.length) {
                            const layer = layers[layerIndex++]!;
                            let content = layer.internalProcessor ? layer.internalProcessor() : argumentsList[argIndex++];
                            if (content === undefined) { continue } // 如果没有内容就跳过当前层
                            if (typeof content === 'object') { content = JSON.stringify(content, undefined, layer.indentJson ? 2 : undefined) }
                            content = layer.processor.reduce((previous, current) => current(previous), content);
                            result.push(layer.chalk(content));
                        }

                        while (argIndex < argumentsList.length) {
                            const content = argumentsList[argIndex++];
                            if (content === undefined) { continue }
                            result.push(content);
                        }
                        return result;
                    }
                    case 'print':
                    case undefined: {
                        console[logType].apply(undefined, proxy.format(...argumentsList));
                        return functionCall = undefined;
                    }
                }
            }
        });

        return proxy[property];
    }
}) as LogFormatter;
