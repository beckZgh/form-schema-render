<template>
   <FormSchemaRender :schema="schema" :model="formModel" labelWidth="150px">
        <template #testFieleLeft="{ $form, props }">
            <el-button v-bind="props">完蛋了{{ $form.input1 }}</el-button>
        </template>
        <template #input1="{ $form }">
            <el-input v-model="$form.input1" />
        </template>
    </FormSchemaRender>
</template>

<script lang="tsx">
import { defineComponent, ref, watch } from 'vue'
  import type { FormSchemaConfig } from './components/FormSchemaRender/types/form';

export default defineComponent({
  name: 'App',
  setup() {
            const schema = ref<FormSchemaConfig[]>([
                {
                    tag: 'el-card',
                    props: ({ $index }) => {
                        return {
                            header: `我是数组类型配置 - ${$index}`,
                            class: 'mt10',
                        };
                    },
                    key: 'arrTest',
                    type: 'array',
                    childrens: [
                        {
                            tag: 'el-card',
                            key: 'innerObjTest',
                            type: 'object',
                            props: {
                                header: '我是动态增减项内部的卡片，且是对象形式的动态增减项',
                            },
                            childrens: [
                                {
                                    tag: 'el-row',
                                    key: 'arrTestRow',
                                    type: 'array',
                                    props: { gutter: 20 },
                                    childrens: [
                                        {
                                            key: 'input1',
                                            tag: 'el-input',
                                            formItem: ({ $index }) => {
                                                return {
                                                    label: `输入框1 - ${$index}`,
                                                };
                                            },
                                            col: 12,
                                            slots: {
                                                prepend: () => 'Http://',
                                                append: () => '.com',
                                            },
                                            fieldLeft: {
                                                slot: 'testFieleLeft',
                                            },
                                            fieldRight: {
                                                render: () => {
                                                    return <el-button>我是右边的按钮</el-button>;
                                                },
                                            },
                                        },
                                        {
                                            key: 'input2',
                                            tag: 'el-input',
                                            label: '输入框2',
                                            subLabel: '(选填)',
                                            labelHelper: 'Test',
                                            col: 12,
                                            slots: {
                                                prepend: () => 'Http://',
                                                append: () => '.com',
                                            },
                                            fieldLeft: {
                                                tag: 'el-button',
                                                slots: {
                                                    default: () => {
                                                        return <span>test</span>;
                                                    },
                                                },
                                            },
                                            fieldRight: {
                                                render: () => {
                                                    return <el-button>我是右边的按钮</el-button>;
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    tag: 'el-card',
                    props: {
                        header: `我是对象类型配置 `,
                        class: 'mt10',
                    },
                    key: 'objTest',
                    type: 'object',
                    childrens: [
                        {
                            tag: 'el-row',
                            props: { gutter: 20 },
                            key: 'objTestArrRow',
                            type: 'array',
                            childrens: [
                                {
                                    key: 'input1',
                                    tag: 'el-input',
                                    label: '输入框1',
                                    col: 12,
                                    on: {
                                        focus: (params, event) => {
                                            console.log('--foucs, e', params, event);
                                        },
                                    },
                                    slots: {
                                        prepend: () => 'Http://',
                                        append: () => '.com',
                                    },
                                    fieldLeft: {
                                        slot: 'testFieleLeft',
                                        props: {
                                            type: 'danger',
                                        },
                                        on: {
                                            click() {
                                                alert(2);
                                            },
                                        },
                                    },
                                    fieldRight: {
                                        tag: 'el-button',
                                        props: {
                                            type: 'danger',
                                        },
                                        slots: {
                                            default: () => '我是右边的按钮',
                                        },
                                        on: {
                                            click() {
                                                alert(1);
                                            },
                                        },
                                    },
                                },
                                {
                                    key: 'input2',
                                    tag: 'el-input',
                                    label: '输入框2',
                                    col: 12,
                                    slots: {
                                        prepend: () => 'Http://',
                                        append: () => '.com',
                                    },
                                    fieldLeft: {
                                        tag: 'el-button',
                                        slots: {
                                            default: () => {
                                                return <span>test</span>;
                                            },
                                        },
                                    },
                                    fieldRight: {
                                        render: () => {
                                            return <el-button>我是右边的按钮</el-button>;
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ]);
            const formModel = ref<Recordable>({
                arrTest: [
                    {
                        innerObjTest: {
                            arrTestRow: [
                                { input1: '1-1', input2: '1-1' },
                                { input1: '1-2', input2: '1-2' },
                            ],
                        },
                    },
                    {
                        innerObjTest: {
                            arrTestRow: [
                                { input1: '1-1', input2: '1-1' },
                                { input1: '1-2', input2: '1-2' },
                            ],
                        },
                    },
                ],
                objTest: {
                    objTestArrRow: [
                        { input1: '1-1', input2: '1-1' },
                        { input1: '1-2', input2: '1-2' },
                    ],
                },
            });

            watch(
                formModel,
                (form) => {
                    console.log('---formModel', form);
                },
                { deep: true }
            );
            return {
                schema,
                formModel,
            };
        },
})
</script>
