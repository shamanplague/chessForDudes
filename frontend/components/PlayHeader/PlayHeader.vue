<template>

  <div class="chess-game-header">
    <div class="chess-game-header__item avatar-image left">
        <img src="/images/garfield.jpg">
      </div>
      <div class="chess-game-header__item username left">
        <span class="chess-game-header__item username text">Garfield</span>
      </div>
      <div class="chess-game-header__item avatar-image right">
        <img src="/images/john.jpg">
      </div>
      <div class="chess-game-header__item username right">
        <span class="chess-game-header__item username text">John</span>
      </div>
  </div>

</template>

<script>

import _ from 'lodash'

export default {
  data () {
    return {
      
    }
  },
  methods : {
    
  }
}

</script>

<style lang="scss" scoped>
@import 'PlayHeader.scss';
</style>