import Vue from "vue";
import Router from "vue-router";
import MainPage from "./views/MainPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "main",
      component: MainPage
    }
  ]
});
