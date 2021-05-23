import type { App } from 'vue';
import { FormSchemaRender, FormItem, FormItemTip } from '../FormSchemaRender';

/**
 * vue3: h 函数不能通过字符引用组件,故在这里注册才可以在表单使用
 */
import {
    ElRadio,
    ElRadioButton,
    ElRadioGroup,
    ElCheckbox,
    ElCheckboxButton,
    ElCheckboxGroup,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElCalendar,
    ElSwitch,
    ElSlider,
    ElTimePicker,
    ElTimeSelect,
    ElDatePicker,
    ElCascader,
    ElCascaderPanel,
    ElUpload,
    ElRate,
    ElColorPicker,
    ElTransfer,
    ElIcon,
    ElButton,
    ElLink,
    ElSpace,
    ElAlert,
    ElDivider,
    ElImage,
    ElCard,
    ElSteps,
    ElStep,
    ElRow,
    ElCol,
    ElTabs,
    ElTabPane,
} from 'element-plus';


const SELECT_TEXT = '请选择';
const INPUT_TEXT = '请输入';
export function setupFormSchemaRender(app: App) {
    FormSchemaRender.setup({
        components: {
            col: ElCol,
            'form-item': FormItem,
            'form-item-tip': FormItemTip,

            // UI框架支持组件列表
            'el-row': ElRow,
            'el-col': ElCol,
            'el-radio': ElRadio,
            'el-radio-button': ElRadioButton,
            'el-radio-group': ElRadioGroup,
            'el-checkbox': ElCheckbox,
            'el-checkbox-button': ElCheckboxButton,
            'el-checkbox-group': ElCheckboxGroup,
            'el-input': ElInput,
            'el-input-number': ElInputNumber,
            'el-select': ElSelect,
            'el-calendar': ElCalendar,
            'el-switch': ElSwitch,
            'el-slider': ElSlider,
            'el-time-picker': ElTimePicker,
            'el-time-select': ElTimeSelect,
            'el-date-picker': ElDatePicker,
            'el-cascader': ElCascader,
            'el-cascader-panel': ElCascaderPanel,
            'el-upload': ElUpload,
            'el-rate': ElRate,
            'el-color-picker': ElColorPicker,
            'el-transfer': ElTransfer,

            'el-icon': ElIcon,
            'el-button': ElButton,
            'el-link': ElLink,
            'el-space': ElSpace,
            'el-alert': ElAlert,
            'el-divider': ElDivider,
            'el-image': ElImage,
            'el-card': ElCard,
            'el-tabs': ElTabs,
            'el-tab-pane': ElTabPane,
            'el-steps': ElSteps,
            'el-step': ElStep,
        },
        placeholderPrefix: {
            // 组件默认占位符
            'el-input': INPUT_TEXT,
            'el-select': SELECT_TEXT,
            'el-time-picker': INPUT_TEXT,
            'el-time-select': INPUT_TEXT,
            'el-cascader': INPUT_TEXT,
        },
    });

    app.use(FormSchemaRender);
}
