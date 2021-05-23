import type { FormFieldRecord, RootFormProvider } from '../types/form';
import { isFunction, isObject, isString, isNumber, isArray } from '../utils';
import { componentMap } from '../setup/setupComponent';
import { FORM_ITEM_TAG } from '../config';

interface RenderComponentParams {
    form: Recordable;
    item?: FormFieldRecord;
    childrens?: FormFieldRecord[];
    index?: number;
    parentKey?: string;
}

interface RenderFieldsParams {
    form: Recordable;
    fields: FormFieldRecord[];
    parentKey?: string;
    index?: number;
}

// 链接递归生成的 key 路径
function joinParentKeyPath(parentKey: string, fieldKey = '', index?: number) {
    if (isNumber(index)) {
        return `${parentKey}${parentKey ? '.' : ''}${fieldKey}[${index}]`;
    } else {
        return `${parentKey}${parentKey ? '.' : ''}${fieldKey || ''}`;
    }
}

// 获取表单内部子控件的 key： 主要是为了解决外部自定义 form-item 时,内部只要声明一个含有key的控件配置即可
function getFormItemPropKey(parentKey: string, childrens: FormFieldRecord[]) {
    if (!childrens || !childrens.length) return;

    for (const item of childrens) {
        if (item.key) return `${parentKey}${item.key}`;
    }

    return;
}

export function useSchemaRender(rootForm: RootFormProvider) {
    // 递归 Field 结构
    function renderFields({ form, fields, parentKey = '', index }: RenderFieldsParams) {
        return fields.map((field) => {
            if (field.key && field.type === 'array') {
                return (form[field.key] || []).map((itemData, index) => {
                    return renderComponent({
                        form,
                        item: field,
                        index,
                        parentKey,
                        childrens: renderFields({
                            form: itemData,
                            fields: field.childrens || [],
                            parentKey: joinParentKeyPath(parentKey, field.key, index),
                            index,
                        }),
                    });
                });
            } else {
                return renderComponent({
                    form,
                    item: field,
                    index,
                    parentKey,
                    childrens: renderFields({
                        form: field.key && field.type === 'object' ? form[field.key] : form,
                        fields: field.childrens || [],
                        parentKey: joinParentKeyPath(parentKey, field.key),
                        index,
                    }),
                });
            }
        });
    }

    // 渲染组件
    function renderComponent({ form, item, childrens, index, parentKey }: RenderComponentParams) {
        if (!item || (!isString(item.tag) && !isFunction(item.render) && !item.slot)) {
            return null;
        }

        // 回调函数注入的参数
        const callbackParams = {
            $form: form,
            $index: index,
            $value: form[item.key || ''],
        };

        // 支持联动
        if (isFunction(item.hidden)) {
            const result = item.hidden(callbackParams);
            if (result) return null;
        } else if (!!item.hidden) {
            return null;
        }

        // Render 函数优先级最高（属于完全自定义）
        if (isFunction(item.render)) return item.render(callbackParams);

        // 支持配置事件处理
        const confOn = item.on || {};
        const componentOn = Object.keys(confOn).reduce((map, k) => {
            if (isFunction(confOn[k])) {
                // 不是以 on 开头的补齐 on
                const eventKey = k.startsWith('on') ? k : `on${k}`;
                const handleFn = confOn[k];
                map[eventKey] = (...rest: any[]) => {
                    handleFn(callbackParams, ...rest);
                };
            }
            return map;
        }, {});

        // 包含静态和动态属性
        const componentProps: Recordable = {
            ...item.props,
            ...((item.dynamicProps && item.dynamicProps(callbackParams)) || {}),
            ...componentOn,
        };

        // slot 插槽注入 (用于个性化的布局需求)
        const slotFn = rootForm.formCtx.slots[item.slot as string];
        if (slotFn && isFunction(slotFn)) {
            return slotFn({ ...callbackParams, props: componentProps });
        }

        // 支持组件本身的作用域插槽
        const componentSlots: Recordable = {};
        if (isObject(item.slots)) {
            const itemSlots = item.slots;
            Object.keys(itemSlots).forEach((k) => {
                if (isFunction(itemSlots[k])) componentSlots[k] = itemSlots[k];
            });
        }

        // 渲染组件
        const Comp = (item.tag && componentMap.get(item.tag)) || item.tag;

        // 设置 FormItem 校验规则
        if (item.tag === FORM_ITEM_TAG && !!item.props.rules) {
            // 设置校验属性
            if (!componentProps.prop) {
                componentProps.prop = getFormItemPropKey(parentKey || '', item.childrens || []);
            }

            // 设置校验规则
            componentProps.rules = genFormItemRules(item, componentProps);
        }

        // 如有位置需求则补充 div 容器
        if (item.key && (item.fieldLeft || item.fieldRight || item.fieldTip)) {
            return (
                <>
                    <div style="display: flex;">
                        {renderComponent({ form, item: item.fieldLeft, index })}
                        {(item.fieldLeft && <div style="width: 10px" />) || null}
                        {
                            <Comp
                                key={item.id}
                                {...componentProps}
                                v-slots={componentSlots}
                                v-model={form[item.key || '']}
                            />
                        }
                        {(item.fieldRight && <div style="width: 10px" />) || null}
                        {renderComponent({ form, item: item.fieldRight, index })}
                    </div>
                    {renderComponent({ form, item: item.fieldTip, index })}
                </>
            );
        } else {
            // 支持自定义组件实现 v-model 方式使用
            return (
                <Comp
                    key={item.id}
                    {...componentProps}
                    v-slots={componentSlots}
                    v-model={form[item.key || '']}
                >
                    {childrens && childrens.length ? childrens : null}
                </Comp>
            );
        }
    }

    // 生成表单校验规则
    function genFormItemRules(item: FormFieldRecord, props: Recordable) {
        if (!item.props.rules || !isArray(item.props.rules)) return;

        return item.props.rules.map((rule) => {
            let _rule_ = { ...rule };

            // 手机号
            if (_rule_.type === 'mobile') {
                _rule_.pattern = _rule_.pattern || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                _rule_.message = _rule_.message || '请输入正确的身份证号';
            }

            // 身份证号
            if (_rule_.type === 'idcard') {
                _rule_.pattern = _rule_.pattern || /1\d{10}/;
                _rule_.message = _rule_.message || '请输入正确的手机号';
            }

            if (!_rule_.message) {
                if (_rule_.required) {
                    _rule_.message = `${props.label}不能为空`;
                } else if (isNumber(_rule_.min) && isNumber(_rule_.max)) {
                    if (_rule_.type === 'number') {
                        _rule_.message = `${props.label}不能小于${_rule_.min}或者大于${_rule_.max}`;
                    } else {
                        _rule_.message = `${props.label}需要在${_rule_.min}到${_rule_.max}个字符`;
                    }
                } else if (isNumber(_rule_.min)) {
                    if (_rule_.type === 'number') {
                        _rule_.message = `${props.label}不能小于${_rule_.min}`;
                    } else {
                        _rule_.message = `${props.label}最小${_rule_.min}个字符`;
                    }
                } else if (isNumber(_rule_.max)) {
                    if (_rule_.type === 'number') {
                        _rule_.message = `${props.label}不能大于${_rule_.max}`;
                    } else {
                        _rule_.message = `${props.label}最大${_rule_.max}个字符`;
                    }
                } else if (_rule_.type === 'email') {
                    _rule_.message = '请输入正确的邮箱';
                } else if (_rule_.type === 'url') {
                    _rule_.message = '请输入正确的网址';
                }
            }

            // 自定义校验
            if (isFunction(_rule_.validator)) {
                const validatorFn = _rule_.validator;
                _rule_.validator = (_rule: any, value: any, callback: Function) => {
                    const err = validatorFn(value, rootForm.formRef.value);
                    callback(isString(err) && err !== '' ? err : undefined);
                };
            }

            // 异步自定义校验
            if (isFunction(_rule_.asyncValidator)) {
                const asyncValidatorFn = _rule_.asyncValidator;
                _rule_.asyncValidator = async (_rule: any, value: any, callback: Function) => {
                    const err = await asyncValidatorFn(value, rootForm.formRef.value);
                    callback(isString(err) && err !== '' ? err : undefined);
                };
            }

            // 默认 blur 事件校验
            _rule_.trigger = _rule_.trigger || 'blur';

            return _rule_;
        });
    }

    return { renderFields };
}
