# log-formatter

为 chalk 提供了一种更加方便的格式化输出方式

## 导入模块

```javascript
import log from 'log-formatter';
```

或者

```javascript
const log = require('log-formatter').default;
```

## 用法

```javascript
log
    .dateTime                   // 在开头打印日期时间
    .text.bold.blue.bgGray      // 第一个参数，灰色背景蓝色粗体
    .text.square.linebreak      // 第二个参数，方括号包裹，结尾换行
    .text.indentJson.yellow     // 第三个参数，黄色字体，采用缩进的方式打印对象
    .print('第一个参数', '第二个参数', { 3: '第三个参数' });
```

[文档](./src/LogFormatter.ts)

[示例](./test/index.test.ts)