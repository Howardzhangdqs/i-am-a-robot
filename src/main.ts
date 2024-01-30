import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import "katex/dist/katex.min.css";
import VueLatex from "vatex";

import { createPinia } from "pinia";

import "./assets/tailwind.css";
import "./assets/polyfill.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.use(VueLatex);

// app.use(router);

app.mount("#app");
