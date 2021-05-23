// 是否为复杂类型
export function isComplexType(type = '') {
    return ['array', 'object'].includes(type);
}
