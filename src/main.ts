import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Textarea from 'primevue/textarea';
import ProgressSpinner from 'primevue/progressspinner';

import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import './style.css';
import App from './App.vue';

const app = createApp(App);

app.use(PrimeVue);

app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('Card', Card);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Textarea', Textarea);
app.component('ProgressSpinner', ProgressSpinner);

app.mount('#app');