import { createApp } from 'vue';

import ElementPlus from 'element-plus';

import App from './components/App.vue';


let app = createApp(App);

app.use(ElementPlus);
app.mount('#app');