"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
/**
 * 用于标准化命令行输出的格式
 */
const log = new Proxy(function () { }, {
    get() {
        return (new Logger_1.Logger).toProxy();
    },
    apply(target, thisArg, argumentsList) {
        (new Logger_1.Logger).log(...argumentsList);
    }
});
exports.default = log;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWtDO0FBR2xDOztHQUVHO0FBQ0gsTUFBTSxHQUFHLEdBQTJCLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFO0lBQzNELEdBQUc7UUFDQyxNQUFNLENBQUMsQ0FBQyxJQUFJLGVBQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFDRCxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhO1FBQ2hDLENBQUMsSUFBSSxlQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0NBQ0osQ0FBUSxDQUFDO0FBRVYsa0JBQWUsR0FBRyxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9Mb2dnZXInO1xyXG5pbXBvcnQgeyBMb2dnZXJQdWJsaWNQcm9wZXJ0aWVzIH0gZnJvbSAnLi9Mb2dnZXJQdWJsaWNQcm9wZXJ0aWVzJztcclxuXHJcbi8qKlxyXG4gKiDnlKjkuo7moIflh4bljJblkb3ku6TooYzovpPlh7rnmoTmoLzlvI9cclxuICovXHJcbmNvbnN0IGxvZzogTG9nZ2VyUHVibGljUHJvcGVydGllcyA9IG5ldyBQcm94eShmdW5jdGlvbiAoKSB7IH0sIHtcclxuICAgIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBMb2dnZXIpLnRvUHJveHkoKTtcclxuICAgIH0sXHJcbiAgICBhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpIHtcclxuICAgICAgICAobmV3IExvZ2dlcikubG9nKC4uLmFyZ3VtZW50c0xpc3QpXHJcbiAgICB9XHJcbn0pIGFzIGFueTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxvZzsiXX0=
