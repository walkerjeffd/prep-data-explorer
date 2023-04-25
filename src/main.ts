import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './plugins/leaflet'
import highcharts from './plugins/highcharts'
import vuetify from './plugins/vuetify'
// @ts-ignore
import { makeServer } from "./mirage/server"

import './assets/main.css'

if (process.env.NODE_ENV === "development") {
  makeServer()
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
// @ts-ignore
app.use(highcharts)

app.mount('#app')
