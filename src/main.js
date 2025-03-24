import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import VueTheMask from 'vue-the-mask'

const app = createApp(App);
const pinia = createPinia();

app.use(VueTheMask);
app.use(pinia);
app.mount('#app');
