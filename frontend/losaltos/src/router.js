import Vue from "vue";
import Router from "vue-router";
import MainPage from "./views/MainPage.vue";
import TestingServer from "./views/TestingServer.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "main",
      component: MainPage
    },
    {
      path:"/testing",
      name:"testing",
      component: TestingServer
    }
  ]
});
