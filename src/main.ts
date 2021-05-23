
import 'element-plus/lib/theme-chalk/index.css';

import { createApp } from 'vue'
import App from './App.vue'
import { setupGlobComp } from './components/setupGlobComp'

const app = createApp(App)
setupGlobComp(app)

app.mount('#app')
