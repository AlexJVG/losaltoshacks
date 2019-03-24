import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
});


export default new Vuex.Store({
  state: {
    username:"",
  },
  mutations: {
    setUser(state,payload){
      this.state.username = payload;
    }
  },
  actions: {},
  plugins: [vuexLocalStorage.plugin]
});
