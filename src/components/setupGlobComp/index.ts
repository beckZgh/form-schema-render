import type { App } from 'vue';

import { setupElemenuPlus } from './setupElemenuPlus';
import { setupFormSchemaRender } from './setupFormSchemaRender'

export function setupGlobComp(app: App) {
    setupElemenuPlus(app);
    setupFormSchemaRender(app);
}
