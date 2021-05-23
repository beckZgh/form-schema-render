import type { App, Component } from 'vue';

import Form from './components/Form.vue';
import FormItem from './components/FormItem.vue';
import FormItemTip from './components/FormItemTip.vue';

import setupComponent from './setup/setupComponent';
import setupPlaceholderPrefix from './setup/setupPlaceholderPrefix';

// 表单配置渲染器全局配置
interface setupParmas {
    components?: { [k: string]: Component };
    placeholderPrefix?: { [k: string]: string };
}
const FormSchemaRender = {
    setup({ components = {}, placeholderPrefix = {} }: setupParmas) {
        setupComponent(components);
        setupPlaceholderPrefix(placeholderPrefix);
    },

    install(app: App) {
        app.component('FormSchemaRender', Form);
    },
};

export { Form, FormItem, FormItemTip, FormSchemaRender };
