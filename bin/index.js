"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
/**
 * 用于标准化命令行输出的格式
 */
const log = new Proxy({}, {
    get() {
        return (new Logger_1.Logger).toProxy();
    },
    apply(target, thisArg, argumentsList) {
        (new Logger_1.Logger).log(...argumentsList);
    }
});
exports.default = log;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWtDO0FBR2xDOztHQUVHO0FBQ0gsTUFBTSxHQUFHLEdBQTJCLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtJQUM5QyxHQUFHO1FBQ0MsTUFBTSxDQUFDLENBQUMsSUFBSSxlQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYTtRQUNoQyxDQUFDLElBQUksZUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUE7SUFDdEMsQ0FBQztDQUNKLENBQVEsQ0FBQztBQUVWLGtCQUFlLEdBQUcsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcclxuaW1wb3J0IHsgTG9nZ2VyUHVibGljUHJvcGVydGllcyB9IGZyb20gJy4vTG9nZ2VyUHVibGljUHJvcGVydGllcyc7XHJcblxyXG4vKipcclxuICog55So5LqO5qCH5YeG5YyW5ZG95Luk6KGM6L6T5Ye655qE5qC85byPXHJcbiAqL1xyXG5jb25zdCBsb2c6IExvZ2dlclB1YmxpY1Byb3BlcnRpZXMgPSBuZXcgUHJveHkoe30sIHtcclxuICAgIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBMb2dnZXIpLnRvUHJveHkoKTtcclxuICAgIH0sXHJcbiAgICBhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpIHtcclxuICAgICAgICAobmV3IExvZ2dlcikubG9nKC4uLmFyZ3VtZW50c0xpc3QpXHJcbiAgICB9XHJcbn0pIGFzIGFueTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxvZyJdfQ==
