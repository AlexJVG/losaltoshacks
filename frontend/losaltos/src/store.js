import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username:"",
  },
  mutations: {
    setUser(state,payload){
      this.state.username = payload;
    }
  },
  actions: {}
});
