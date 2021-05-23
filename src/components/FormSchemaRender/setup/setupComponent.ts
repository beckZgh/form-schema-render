import { Component } from 'vue';
import { warn } from '../utils';

export const componentMap = new Map<string, any>();

// 添加使用组件 (可用于页面临时添加)
export function addComponent(compName: string, component: Component) {
    if (componentMap.has(compName)) {
        warn(`${compName}已存在`);
        return;
    }

    componentMap.set(compName, component);
}

// 删除使用组件 (可用于页面临时添加后删除)
export function delComponent(compName: string) {
    if (!componentMap.has(compName)) return; // 不存在的组件则退出

    componentMap.delete(compName);
}

// 初始化配置使用组件
export default function setupComponent(config: { [k: string]: Component }) {
    Object.keys(config).forEach((k) => {
        componentMap.set(k, config[k]);
    });
}
