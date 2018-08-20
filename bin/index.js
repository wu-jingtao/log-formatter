"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogFormatter_1 = require("./LogFormatter");
const __LogFormatter_Proxy = new Proxy({}, {
    get(target, property) {
        const logger = new Proxy(new LogFormatter_1.LogFormatter, {
            apply(target, thisArg, argArray) {
                target.print(...argArray);
            }
        });
        return logger[property];
    }
});
exports.default = __LogFormatter_Proxy;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQThDO0FBRzlDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFO0lBQ3ZDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLE1BQU0sR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLDJCQUFZLEVBQUU7WUFDNUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUTtnQkFDM0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLENBQUM7U0FDSixDQUFDLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0osQ0FBdUIsQ0FBQztBQUV6QixrQkFBZSxvQkFBb0IsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ0Zvcm1hdHRlciB9IGZyb20gXCIuL0xvZ0Zvcm1hdHRlclwiO1xyXG5pbXBvcnQgeyBMb2dGb3JtYXR0ZXJfUHJveHkgfSBmcm9tIFwiLi9Mb2dGb3JtYXR0ZXJfUHJveHlcIjtcclxuXHJcbmNvbnN0IF9fTG9nRm9ybWF0dGVyX1Byb3h5ID0gbmV3IFByb3h5KHt9LCB7XHJcbiAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgIGNvbnN0IGxvZ2dlcjogYW55ID0gbmV3IFByb3h5KG5ldyBMb2dGb3JtYXR0ZXIsIHtcclxuICAgICAgICAgICAgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnByaW50KC4uLmFyZ0FycmF5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbG9nZ2VyW3Byb3BlcnR5XTtcclxuICAgIH1cclxufSkgYXMgTG9nRm9ybWF0dGVyX1Byb3h5O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19Mb2dGb3JtYXR0ZXJfUHJveHk7Il19
