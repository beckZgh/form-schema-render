import type { FormProps, FormSchemaConfig, FormFieldRecord } from '../types/form';

import { warn, isBoolean, isFunction, isObject, isNumber, isString, isArray } from '../utils';
import { isComplexType } from '../helper/formHelper';
import { ref, onMounted } from 'vue';

import { useId } from './useId';
import { FORM_ITEM_TAG, FORM_ITEM_TIP_TAG, COL_TAG } from '../config';
import { placeholderPrefixMap } from '../setup/setupPlaceholderPrefix';

interface LoadSchemaParms {
    schema: FormSchemaConfig[];
    form: Recordable;
    fields: FormFieldRecord[];
    isNested: boolean;
}

export function useSchema(props: FormProps) {
    const formRef = ref<Recordable>(props.model);
    const fieldsRef = ref<FormFieldRecord[]>([]);
    const inited = ref(false);
    const { genId } = useId();

    onMounted(() => {
        if (!props.schema.length) return;

        loadSchmea({
            schema: props.schema,
            form: formRef.value,
            fields: fieldsRef.value,
            isNested: false,
        });

        inited.value = true;
    });

    // 读取表单配置
    function loadSchmea({ schema, form, fields, isNested }: LoadSchemaParms) {
        schema.forEach((item) => {
            // 设置表单默认值
            if (!isNested) setFormDefValue(item, form);

            let field: FormFieldRecord | null = null;
            if (item.key && !isComplexType(item.type) && !item.childrens) {
                // 生成表单组件
                field = genField(item);

                // 补充 form-Item
                if (item.formItem !== false) {
                    const formItemField = genFormItemField(item);
                    formItemField.childrens = [field];
                    field = formItemField;
                } else {
                    // 不自动补充 form-item 的时候, hidden 作用于自身
                    field.hidden = item.hidden;
                }

                // 补充 col
                if (item.col) {
                    const colField = genColField(item);
                    colField.childrens = [field];
                    field = colField;
                }
            } else {
                // 生成组件
                field = genTagField(item);
            }

            // 取出子级
            if (item.childrens && item.childrens.length) {
                field.childrens = [];
                loadSchmea({
                    schema: item.childrens,
                    form,
                    fields: field.childrens,
                    isNested: isNested ? isNested : isComplexType(item.type),
                });
            }

            // 设置父级
            fields.push(field);
        });
    }

    // 设置普通表单属性默认值
    function setFormDefValue(item: FormSchemaConfig, form: Recordable) {
        if (isComplexType(item.type)) {
            if (item.type === 'array') {
                setFormArrayValue(item, form);
            } else {
                setFormObjectValue(item, form);
            }
        } else {
            const key = item.key as string;
            form[key] = form[key] || item.value || getTypeDefVal(item.type || ''); // 表单数据对象 -> 配置默认值 -> 默认为空
        }
    }

    // 获取表单 object 类型默认值
    function setFormObjectValue(item: FormSchemaConfig, form: Recordable) {
        const key = item.key as string;

        // 有传入值，则使用，且不寻找默认值
        if (form[key] && !isObject(form[key])) warn('Object类型传入值必须是个对象');
        if (form[key] && isObject(form[key])) return;

        // 配置默认值，则使用，且不寻找默认值
        if (item.value && !isObject(item.value)) warn('Object类型传入值必须是个对象');
        if (item.value && isObject(item.value)) {
            form[key] = item.value;
            return;
        }

        form[key] = {};
        loadComplexTypeChildDefValue(form[key], item.childrens);
    }

    // 获取表单 array 类型默认值
    function setFormArrayValue(item: FormSchemaConfig, form: Recordable) {
        const key = item.key as string;

        // 有传入值，则使用，且不寻找默认值
        if (form[key] && !isArray(form[key])) warn('Array类型传入值必须是个数组');
        if (form[key] && isArray(form[key])) return form[key];

        // 配置默认值，则使用，且不寻找默认值
        if (item.value && !isArray(item.value)) warn('Array类型传入值必须是个数组');
        if (item.value && isArray(item.value)) {
            form[key] = item.value;
            return form[key];
        }

        const arrItem = {};
        form[key] = [arrItem];
        loadComplexTypeChildDefValue(arrItem, item.childrens);
    }

    // 读取复杂类型子项默认值
    function loadComplexTypeChildDefValue(obj: Recordable, childrens?: FormSchemaConfig[]) {
        if (!childrens || !childrens.length) return;

        childrens.forEach((c) => {
            if (c.key && c.type === 'array') {
                const cArrItem = {};
                obj[c.key] = [cArrItem];
                loadComplexTypeChildDefValue(cArrItem, c.childrens);
            } else if (c.key && c.type === 'object') {
                obj[c.key] = {};
                loadComplexTypeChildDefValue(obj[c.key], c.childrens);
            } else if (c.key) {
                obj[c.key] = c.value || getTypeDefVal(c.type || '');
            } else {
                loadComplexTypeChildDefValue(obj, c.childrens);
            }
        });
    }

    // 获取基础类型默认值
    function getTypeDefVal(type: string) {
        switch (type) {
            case 'number':
                return 0;
            case 'boolean':
                return false;
            default:
                return '';
        }
    }

    // 转换配置为可用的表单渲染项
    function genField(item: FormSchemaConfig) {
        const field: FormFieldRecord = {
            id: genId(),
            key: item.key,
            tag: item.tag,
            props: {
                ...(isObject(item.props) ? item.props : {}),
                placeholder: getFieldPlaceholder(item),
            },
            dynamicProps: isFunction(item.props) ? item.props : undefined,

            slot: getFieldSlotName(item),
            render: item.render,
            slots: item.slots,

            fieldLeft: item.fieldLeft ? genTagField(item.fieldLeft) : undefined,
            fieldRight: item.fieldRight ? genTagField(item.fieldRight) : undefined,
            fieldTip: undefined,
            on: item.on,
        };

        if (isString(item.fieldTip)) {
            field.fieldTip = genTagField({
                tag: FORM_ITEM_TIP_TAG,
                props: { text: item.fieldTip },
            });
        } else if (isObject(item.fieldTip)) {
            field.fieldTip = genTagField(item.fieldTip);
        }

        return field;
    }

    // 生成 form-item
    function genFormItemField(item: FormSchemaConfig): FormFieldRecord {
        return {
            id: genId(),
            tag: FORM_ITEM_TAG,
            props: {
                label: item.label,
                subLabel: item.subLabel,
                labelHelper: item.labelHelper,
                rules: item.rules,
                ...(isObject(item.formItem) ? item.formItem : {}),
            },
            dynamicProps: isFunction(item.formItem) ? item.formItem : undefined,
            hidden: item.hidden,
        };
    }

    // 生成 col
    function genColField(item: FormSchemaConfig): FormFieldRecord {
        return {
            id: genId(),
            tag: COL_TAG,
            props: {
                ...((isNumber(item.col) && { span: item.col }) ||
                    (isObject(item.col) ? item.col : {})),
            },
            dynamicProps: isFunction(item.col) ? item.col : undefined,
        };
    }

    // 生成其他标签
    function genTagField(item: FormSchemaConfig): FormFieldRecord {
        const field: FormFieldRecord = {
            id: genId(),
            tag: item.tag,
            key: item.key,
            type: item.type,
            props: { ...(isObject(item.props) ? item.props : {}), rules: item.rules },
            dynamicProps: isFunction(item.props) ? item.props : undefined,
            hidden: item.hidden,
            render: item.render,
            slot: getFieldSlotName(item),
            slots: item.slots,
            on: item.on,
        };

        return field;
    }

    // 获取 slot name
    function getFieldSlotName(item: FormSchemaConfig) {
        if (isString(item.slot)) return item.slot;
        if (isBoolean(item.slot)) return item.key;

        return undefined;
    }

    // 获取组件默认提示
    function getFieldPlaceholder(item: FormSchemaConfig) {
        if (item.placeholder) return item.placeholder;

        const prefixStr = placeholderPrefixMap.get(item.tag || '');
        return prefixStr ? `${prefixStr}${item.label}` : undefined;
    }

    return {
        formRef,
        fieldsRef,
    };
}
