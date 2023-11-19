import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia' // 导入 Pinia
// highlight 的样式，依赖包，组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './reset.less'
//注册组件
const app = createApp(App)
app.use(createPinia()).use(router).use(ElementPlus).mount('#app')

