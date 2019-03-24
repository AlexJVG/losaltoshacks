import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify, {
  VApp,
  VLayout,
  VFlex,
  VCarousel,
  VCarouselItem,
  VImg,
  VBtn,
  VToolbar,
  VToolbarItems,
  VToolbarSideIcon,
  VToolbarTitle,
  VSpacer,
  VCard,
  VCardText,
  VCardActions,
  VCardTitle,
  VDialog,
  VNavigationDrawer
} from "vuetify/lib";
Vue.use(Vuetify, {
  components: {
    VApp,
    VLayout,
    VFlex,
    VCarousel,
    VCarouselItem,
    VImg,
    VBtn,
    VToolbar,
    VToolbarItems,
    VToolbarSideIcon,
    VToolbarTitle,
    VSpacer,
    VCard,
    VCardText,
    VCardActions,
    VCardTitle,
    VDialog,
    VNavigationDrawer
  }
});
import "vuetify/dist/vuetify.min.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
