<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'FormItem',
        props: {
            label: String,
            subLabel: String,
            labelHelper: String,
        },
        setup(props) {
            return {
                props,
            };
        },
    });
</script>

<template>
    <ElFormItem v-bind="$attrs">
        <template #label>
            <div class="form-item-label">
                <ElTooltip v-if="props.labelHelper" :content="props.labelHelper" placement="top">
                    <i class="el-icon-warning form-item-label__icon" />
                </ElTooltip>
                <span>{{ props.label }}</span>
                <span class="form-item-label__sublabel">{{ props.subLabel }}</span>
            </div>
        </template>
        <slot></slot>
    </ElFormItem>
</template>

<style scoped>
    .form-item-label {
        display: inline-flex;
        align-items: center;

    }
    
    .form-item-label__icon {
        font-size: 16px;
        vertical-align: middle;
        margin-right: 5px;
    }

    .form-item-label__sublabel {
        margin-left: 5px;
        font-size: 12px;
        color: #909399;
    }
</style>
