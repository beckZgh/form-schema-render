import type { FormFieldRecord, RootFormProvider } from '../types/form';
import { defineComponent, inject } from 'vue';
import { useSchemaRender } from '../hooks/useSchemaRender';

export default defineComponent({
    name: 'RenderFields',
    props: {
        fields: { type: Array as PropType<FormFieldRecord[]>, default: () => [] },
    },
    setup(props) {
        const rootForm = inject<RootFormProvider>('rootForm') as RootFormProvider;
        const { renderFields } = useSchemaRender(rootForm);

        return () => {
            return rootForm
                ? renderFields({
                      form: rootForm.formRef.value,
                      fields: props.fields,
                  })
                : null;
        };
    },
});
