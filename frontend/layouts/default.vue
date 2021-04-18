<template>
  <div class="root">
    <HeaderNav />
    <div class="warnings-wrapper">
      <div class="warnings">
        <b-alert v-for="item in backendErrors" :key="item.id" show variant="danger">{{ item.message }}</b-alert>
        <b-alert v-for="item in backendNotifications" :key="item.id" show variant="info">{{ item.message }}</b-alert>
      </div>
    </div>
    <Nuxt />
  </div>
</template>

<script>

import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import HeaderNav from '../components/HeaderNav/HeaderNav'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { DropdownPlugin, TablePlugin } from 'bootstrap-vue'
Vue.use(DropdownPlugin)
Vue.use(TablePlugin)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

Vue.use(require('vue-cookies'))

export default {
  mounted () {
    console.log('Маунт приложения')
    // this.$store.dispatch('setTokenFromCookies')
  },
  components : {
    HeaderNav
  },
  watch : {
    backendErrors (v) {
      console.log('backendErrors изменился', v)
    },
    backendNotifications (v) {
      console.log('backendErrors изменился', v)
    },
  },
  computed: {
    backendErrors () {
      return this.$store.state.backendErrors
    },
    backendNotifications () {
      return this.$store.state.backendNotifications
    }
  }
}

</script>


<style lang="scss">
@import './default.scss'
</style>
