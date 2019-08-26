import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import course from './course'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    course
  }
})

export default store
