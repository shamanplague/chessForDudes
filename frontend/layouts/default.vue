<template>
  <div>
    <div class="warnings-wrapper">
      <div class="warnings">
        <b-alert v-for="item in backendErrors" :key="item.id" show variant="danger">{{ item.message }}</b-alert>
      </div>
    </div>
    <Nuxt />
  </div>
</template>

<script>

import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

Vue.use(require('vue-cookies'))

export default {
  mounted () {
    console.log('Маунт приложения')
    // this.$store.dispatch('setTokenFromCookies')
  },
  watch : {
    backendErrors (v) {
      console.log('backendErrors изменился', v)
    }
  },
  computed: {
    backendErrors () {
      return this.$store.state.backendErrors
    }
  }
}

</script>


<style>
@import './index.css'
</style>
