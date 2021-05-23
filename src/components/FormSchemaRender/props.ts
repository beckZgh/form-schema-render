import type { FormSchemaConfig } from './types/form';

const formProps = {
    /** 是否禁用表单 */
    disabled: { type: Boolean, default: false },
    /** label 宽度 */
    labelWidth: { type: String, default: '100px' },
    /** label 后缀 */
    labelSuffix: { type: String, default: ':' },
    /** label 位置 */
    labelPosition: { type: String as PropType<'right' | 'left' | 'top'>, default: 'left' },
    /** 行内表单 */
    inline: { type: Boolean, default: false },
    /** 是否显示必填字段的标签旁边的红色星号 */
    hideRequiredAsterisk: { type: Boolean, default: false },
    /** 是否显示校验错误信息 */
    showMessage: { type: Boolean, default: true },
    /** 是否以行内形式展示校验信息 */
    inlineMessage: { type: Boolean, default: false },
    /** 是否在输入框中显示校验结果反馈图标 */
    statusIcon: { type: Boolean, default: false },
    /** 是否在 rules 属性改变后立即触发一次验证 */
    validateOnRuleChange: { type: Boolean, default: true },
    /** 用于控制该表单内组件的尺寸 */
    size: { type: String as PropType<'medium' | 'small' | 'mini'>, default: 'mini' },
};

interface FormBtn {
    0: string /** 事件名 */;
    1: string /** 按钮名称 */;
    2: boolean | Recordable | ((form: Recordable) => Recordable);
}

const btnProps = {
    /** 显示提交按钮 */
    showSubmitBtn: { type: Boolean, default: false },
    /** 禁用提交按钮 */
    disableSubmitBtn: { type: Boolean, default: false },
    /** 提交按钮文本 */
    submitBtnText: { type: String, default: '提交' },
    /** 显示重置按钮 */
    showResetBtn: { type: Boolean, default: false },
    /** 禁用重置按钮 */
    disableResetBtn: { type: Boolean, default: false },
    /** 重置按钮文本 */
    resetBtnText: { type: String, default: '重置' },
    /** 按钮位置 */
    btnPosition: { type: String as PropType<'left' | 'right' | 'center'>, default: 'left' },
    /** 按钮容器位置 */
    btnWrapPosition: { type: String as PropType<'top' | 'bottom'>, default: 'bottom' },
    /** 按钮容器样式 */
    btnWrapStyle: { type: Object as PropType<Recordable>, default: () => {} },
    /** 按钮集合 */
    btns: { type: Array as PropType<FormBtn[]>, default: () => [] },
};

const apiProps = {
    /** 提交函数 */
    submit: Function,
    /** 提交成功提示语 */
    submitSuccessMsg: { type: String, default: '提交成功' },
    /** 提交失败提示语 */
    submitErrorMsg: { type: String, default: '提交失败' },
    /** 提交后返回上一个页面：用于开启一个新的页面编辑表单 */
    backBySubmited: { type: Boolean, default: false },
};

export default {
    ...formProps,
    ...btnProps,
    ...apiProps,

    /** 表单配置 */
    schema: { type: Array as PropType<FormSchemaConfig[]>, default: () => [] },
    /** 表单数据 */
    model: { type: Object as PropType<Recordable>, default: () => {} },
};
