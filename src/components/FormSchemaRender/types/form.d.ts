import type { VNodeChild, Ref, SetupContext } from 'vue';
import type { RuleType, RuleItem } from 'async-validator';
import type { ComponentType } from './component-type';

/** 表单校验配置 */
export interface FormSchemaRuleItem
    extends Omit<RuleItem, 'type' | 'validator' | 'asyncValidator'> {
    type?: RuleType | 'mobile' | 'idcard';
    validator?: (val: unknown, form: unknown) => string | null | undefined /** 自定义校验 */;
    asyncValidator?: (
        val: unknown,
        form: unknown
    ) => Promise<string | null | undefined> /** 自定义校验 */;
    trigger?: 'change' | 'blur' | ('change' | 'blur')[];
}

/** 配置中回调参数 */
export interface FormSchemaCallBackParams {
    $value: any;
    $form: Recordable;
    $index?: number;
}

/** 表单配置转换后得到的记录 */
export interface FormFieldRecord {
    id: string;

    key?: string /** 响应值 key */;
    type?: 'array' | 'object' | 'string' | 'number' | 'boolean' /** 字段类型 */;
    tag?: ComponentType /** 组件标签 */;

    props: Recordable /** 组件属性 */;
    dynamicProps?: (params: FormSchemaCallBackParams) => Recordable /** 动态组件属性 */;

    hidden?: boolean | ((params: FormSchemaCallBackParams) => boolean) /** 是否显示 */;

    render?: (params: FormSchemaCallBackParams) => VNodeChild /** 渲染函数 */;
    slot?: string /** 插槽 */;
    slots?: { [name: string]: (...args: any[]) => VNodeChild } /** 作用域插槽 */;
    on?: Recordable<(params: FormSchemaCallBackParams, ...rest: any) => any> /** 事件处理 */;
    rules?: FormSchemaRuleItem[];

    fieldLeft?: FormFieldRecord /** 控件左侧配置 */;
    fieldRight?: FormFieldRecord /** 控件右侧配置 */;
    fieldTip?: FormFieldRecord /** 控件提示配置 */;

    childrens?: FormFieldRecord[];
}

/** 表单配置 */
export interface FormSchemaConfig {
    type?: 'array' | 'object' | 'string' | 'number' | 'boolean' /** 字段类型 */;
    key?: string /** 响应值 key */;

    tag?: ComponentType /** 组件标签 */;
    label?: string /** 标题 */;
    subLabel?: string /** 次级标题 */;
    labelHelper?: string /** 标题辅助信息 */;
    placeholder?: string /** 占位符 */;
    value?: any /** 默认值 */;

    inputFormat?: (params: FormSchemaCallBackParams) => any /** 输入格式化 */;
    outputFormat?: (params: FormSchemaCallBackParams) => any /** 输出格式化 */;
    on?: Recordable<(params: FormSchemaCallBackParams, ...rest: any) => any> /** 事件处理 */;

    rules?: FormSchemaRuleItem[] /** 校验规则 */;

    props?: Recordable | ((params: FormSchemaCallBackParams) => Recordable) /** 组件属性 */;
    hidden?: boolean | ((params: FormSchemaCallBackParams) => boolean) /** 是否显示 */;

    col?:
        | Number
        | Recordable
        | ((params: FormSchemaCallBackParams) => Recordable) /** el-col配置 */;
    formItem?:
        | Boolean
        | Recordable
        | ((params: FormSchemaCallBackParams) => Recordable) /** 表单项组件属性 */;

    slot?: boolean | string /** 插槽 */;
    render?: (params: FormSchemaCallBackParams) => VNodeChild /** 渲染函数 */;
    slots?: { [name: string]: (...args: any[]) => VNodeChild } /** 作用域插槽 */;

    fieldLeft?: FormSchemaConfig /** 控件左侧配置 */;
    fieldRight?: FormSchemaConfig /** 控件右侧配置 */;
    fieldTip?: FormSchemaConfig | string /** 控件提示配置 */;

    childrens?: FormSchemaConfig[] /** 子项 */;
}

/** 表单按钮配置 */
interface FormBtn {
    0: string /** 事件名 */;
    1: string /** 按钮名称 */;
    2: boolean | Recordable | ((form: Recordable) => Recordable);
}

/** 表单属性 */
export type FormProps = {
    /** 表单配置 */
    schema: FormSchemaConfig[];
    /** 表单数据 */
    model: Recordable;

    /** 是否禁用表单 */
    disabled?: boolean;
    /** label 宽度 */
    labelWidth?: string;
    /** label 后缀 */
    labelSuffix?: string;
    /** label 位置 */
    labelPosition?: 'right' | 'left' | 'top';
    /** 行内表单 */
    inline?: boolean;
    /** 是否显示必填字段的标签旁边的红色星号 */
    hideRequiredAsterisk?: boolean;
    /** 是否显示校验错误信息 */
    showMessage?: boolean;
    /** 是否以行内形式展示校验信息 */
    inlineMessage?: boolean;
    /** 是否在输入框中显示校验结果反馈图标 */
    statusIcon?: boolean;
    /** 是否在 rules 属性改变后立即触发一次验证 */
    validateOnRuleChange?: boolean;
    /** 用于控制该表单内组件的尺寸 */
    size?: 'medium' | 'small' | 'mini';

    /** 显示提交按钮 */
    showSubmitBtn?: boolean;
    /** 禁用提交按钮 */
    disableSubmitBtn?: boolean;
    /** 提交按钮文本 */
    submitBtnText?: string;
    /** 显示重置按钮 */
    showResetBtn?: boolean;
    /** 禁用重置按钮 */
    disableResetBtn?: boolean;
    /** 重置按钮文本 */
    resetBtnText?: string;
    /** 按钮位置 */
    btnPosition?: 'left' | 'right' | 'center';
    /** 按钮容器位置 */
    btnWrapPosition?: 'top' | 'bottom';
    /** 按钮容器样式 */
    btnWrapStyle?: CSSProperties;
    /** 按钮集合 */
    btns?: FormBtn[];

    /** 提交函数 */
    submit?: Function;
    /** 提交成功提示语 */
    submitSuccessMsg: string;
    /** 提交失败提示语 */
    submitErrorMsg: string;
    /** 提交后返回上一个页面：用于开启一个新的页面编辑表单 */
    backOnSubmited: boolean;
};

/** 表单注入 */
export interface RootFormProvider {
    props: FormProps;
    formRef: Ref<Recordable>;
    formCtx: SetupContext;
}
