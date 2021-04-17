<template>

    <b-navbar toggleable="sm" variant="light">
    <b-navbar-brand class="pl-4" to="/">ChessForDudes</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse class="pr-4" id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/">Игры</b-nav-item>
        <b-nav-item to="/" disabled>Логин</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

</template>

<script>

import Vue from 'vue'
import _ from 'lodash'

export default {

}

</script>

<style lang="scss" scoped>
@import 'HeaderNav.scss';
</style>