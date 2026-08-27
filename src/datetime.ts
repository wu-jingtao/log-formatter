/**
 * 获取当前时间字符串
 * @description 格式为 HH:mm:ss
 */
export function getTime(): string {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

/**
 * 获取当前日期字符串
 * @description 格式为 YYYY-MM-DD
 */
export function getDate(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/**
 * 获取当前日期时间字符串
 * @description 格式为 YYYY-MM-DD HH:mm:ss
 */
export function getDateTime(): string {
    const d = new Date();
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${mo}-${da} ${h}:${mi}:${s}`;
}
