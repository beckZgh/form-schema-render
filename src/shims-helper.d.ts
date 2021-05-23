/**
 * 该模块用于配置辅助开发时用的类型
 */

import type {
    PropType as VuePropType,
    CSSProperties as VueCSSProperties,
} from 'vue';

declare global {
    /** props 声明类型 */
    declare type PropType<T> = VuePropType<T>;

    /** 样式属性 */
    declare type CSSProperties = VueCSSProperties;

    /** 可写入的对象 */
    export type Writable<T> = {
        -readonly [P in keyof T]: T[P];
    };

    /** 可为 Null 的类型 */
    declare type Nullable<T> = T | null;

    /** 不可为 Null | Undefined 的类型 */
    declare type NonNullable<T> = T extends null | undefined ? never : T;

    /** key为 string，值为 any 类型的对象 */
    declare type Recordable<T = any> = Record<string, T>;

    /** 只读的 key为 string，值为 any 类型的对象 */
    declare type ReadonlyRecordable<T = any> = {
        readonly [key: string]: T;
    };

    declare type Indexable<T = any> = {
        [key: string]: T;
    };

    /** 递归所有属性为可选属性 */
    declare type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    };

    /** setTimeout 类型 */
    declare type TimeoutHandle = ReturnType<typeof setTimeout>;

    /** setInterval 类型 */
    declare type IntervalHandle = ReturnType<typeof setInterval>;

    /** input change 类型 */
    declare interface ChangeEvent extends Event {
        target: HTMLInputElement;
    }

    declare function parseInt(s: string | number, radix?: number): number;

    declare function parseFloat(string: string | number): number;

    /** 滚动事件 类型 */
    declare interface WheelEvent {
        path?: EventTarget[];
    }


    declare interface Fn<T = any, R = T> {
        (...arg: T[]): R;
    }

    declare interface PromiseFn<T = any, R = T> {
        (...arg: T[]): Promise<R>;
    }

    declare type RefType<T> = T | null;

    /** 选项 Options 常用的数据结构 */
    declare type LabelValueOptions = {
        label: string;
        value: any;
    }[];

    /** 事件抛出类型 */
    declare type EmitType = (event: string, ...args: any[]) => void;

    /** window.open 打开网页的类型 */
    declare type TargetContext = '_self' | '_blank';

    /** 元素节点对象类型 */
    declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

    /** 组件元素节点对象类型 */
    declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
        $el: T;
    }

    /** 组件对象类型 */
    declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
}
