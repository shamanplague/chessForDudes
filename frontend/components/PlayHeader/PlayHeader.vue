<template>

  <div class="chess-game-header">
    <div class="chess-game-header__item left-player">
      <div class="chess-game-header__item avatar-image left">
        <img src="/images/garfield.jpg">
      </div>
      <div class="chess-game-header__item username left">
        <span class="chess-game-header__item username text">Garfield</span>
      </div>
    </div>

    <div class="chess-game-header__item move-info">
      <div v-if="isMyMove" class="chess-game-header__item text">Ваш ход</div>
      <div v-else class="chess-game-header__item text">Ход соперника</div>
      <div class="chess-game-header__item timer">0:30</div>
    </div>

    <div class="chess-game-header__item right-player">
      <div class="chess-game-header__item avatar-image right">
        <img src="/images/john.jpg">
      </div>
      <div class="chess-game-header__item username right">
        <span class="chess-game-header__item username text">John</span>
      </div>
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
  props: [ 'isMyMove' ],
  methods : {
    
  }
}

</script>

<style lang="scss" scoped>
@import 'PlayHeader.scss';
</style>