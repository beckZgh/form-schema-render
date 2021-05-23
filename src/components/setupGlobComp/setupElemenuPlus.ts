import type { App } from 'vue';

import ElementPlus from 'element-plus';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale/lang/zh-cn';

export function setupElemenuPlus(app: App) {
    app.use(ElementPlus, {
        size: 'mini',
        locale,
    });
}
