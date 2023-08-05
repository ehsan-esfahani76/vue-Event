import { createApp, defineAsyncComponent } from "vue";
import { createPinia } from "pinia";
import VueCookies from "vue3-cookies";
import App from "./App.vue";
import router from "./router";
import Input from "./common/components/inputs/BaseInput.vue";
import DateTimePicker from "./modules/components/dateTimePicker/DateTimePicker.vue";
import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const app = createApp(App);
app.component(
  "BaseButton",
  defineAsyncComponent(() =>
    import("./common/components/button/BaseButton.vue")
  )
);
app.component(
  "BaseModal",
  defineAsyncComponent(() => import("./common/components/modal/BaseModal.vue"))
);
app.component(
  "BaseIcon",
  defineAsyncComponent(() => import("./common/components/icon/BaseIcon.vue"))
);
app.component("DateTimePicker", DateTimePicker);
app.component(
  "PersianDatepicker",
  defineAsyncComponent(() => import("vue3-persian-datetime-picker"))
);
app.component("BaseInput", Input);
app.component(
  "BaseLoading",
  defineAsyncComponent(() =>
    import("./common/components/loading/BaseLoading.vue")
  )
);
app.component(
  "BaseCard",
  defineAsyncComponent(() => import("./common/components/card/BaseCard.vue"))
);
app.component(
  "MoreMenu",
  defineAsyncComponent(() =>
    import("./modules/components/moreMenu/MoreMenu.vue")
  )
);
app.use(createPinia());
app.use(router);
router.app = app;
app.use(VueCookies);
app.use(Vue3Toasity, {
  rtl: true,
});

app.mount("#app");

window.addEventListener("load", () => {
  navigator.serviceWorker.register("/sw.js");
});
