<script lang="ts">
    import type { FormProps, RootFormProvider } from '../types/form';

    import { defineComponent, provide } from 'vue';
    import { useSchema } from '../hooks/useSchema';
    import RenderFields from './RenderFields';
    import props from '../props';

    export default defineComponent({
        name: 'FormSchemaRender',
        components: { RenderFields },
        inheritAttrs: false,
        props,
        setup(props, ctx) {
            // data
            const { formRef, fieldsRef } = useSchema((props as unknown) as FormProps);

            // provide
            provide<RootFormProvider>('rootForm', {
                props: (props as unknown) as FormProps,
                formRef,
                formCtx: ctx,
            });

            return {
                props,
                formRef,
                fieldsRef,
            };
        },
    });
</script>

<template>
    <el-form
        :model="formRef"
        :labelSuffix="props.labelSuffix"
        :labelWidth="props.labelWidth"
        :labelPosition="props.labelPosition"
        :inline="props.inline"
        :hideRequiredAsterisk="props.hideRequiredAsterisk"
        :showMessage="props.showMessage"
        :inlineMessage="props.inlineMessage"
        :statusIcon="props.statusIcon"
        :validateOnRuleChange="props.validateOnRuleChange"
        :size="props.size"
        :disabled="disabled"
        @submit.stop
    >
        <RenderFields :fields="fieldsRef" />
    </el-form>
</template>
