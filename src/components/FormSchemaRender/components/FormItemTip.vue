<script lang="tsx">
    import { defineComponent, computed } from 'vue';
    import { isNumber } from '../utils';

    export default defineComponent({
        name: 'FormItemTip',

        props: {
            /** 文本内容 */
            text: { type: String, default: '' },
            /** 文本颜色 */
            color: { type: String, default: '#c0c4cc' },
            /** 文字大小 */
            fontSize: { type: [Number, String], default: 12 },
            /** margin-top 值*/
            top: { type: [Number, String], default: 5 },
            /** margin-bottom 值*/
            bottom: { type: [Number, String], default: 0 },
        },

        setup(props) {
            const textStyle = computed(() => {
                return {
                    color: props.color,
                    fontSize: isNumber(props.fontSize) ? `${props.fontSize}px` : props.fontSize,
                    marginTop: isNumber(props.top) ? `${props.top}px` : props.top,
                    marginBottom: isNumber(props.bottom) ? `${props.bottom}px` : props.bottom,
                    lineHeight: '18px',
                };
            });

            return () => {
                return <div style={textStyle.value}>{props.text}</div>;
            };
        },
    });
</script>
