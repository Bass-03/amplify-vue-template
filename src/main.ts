import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import { createMemoryHistory, createRouter } from 'vue-router'
import outputs from "../amplify_outputs.json";

import HomeView from './components/Todos.vue'
import SayHello from './components/SayHello.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/hello', component: SayHello },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

Amplify.configure(outputs);

createApp(App)
  .use(router)
  .mount("#app");
