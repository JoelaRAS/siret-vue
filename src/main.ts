import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Calendar from 'primevue/calendar';

import App from './App.vue';
import './style.css';

const app = createApp(App);

app.use(PrimeVue);

app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('RadioButton', RadioButton);
app.component('Calendar', Calendar);

app.mount('#app');