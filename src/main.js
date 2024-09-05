import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { projectAuth } from "./firebase/config";
import i18n from "./locales/i18n";
import "./assets/main.css";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

let app;

projectAuth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
      .use(i18n)
      .use(vuetify)
      .use(store)
      .use(router)
      .mount("#app");
  }
});
