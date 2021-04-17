<template>
  <div>

    <div class="play-header">
      <div class="play-header__item avatar-image left">
        <img src="/images/garfield.jpg">
      </div>
      <div class="play-header__item username left">
        <span class="play-header__item username text">Garfield</span>
      </div>
      <div class="play-header__item avatar-image right">
        <img src="/images/john.jpg">
      </div>
      <div class="play-header__item username right">
        <span class="play-header__item username text">John</span>
      </div>
    </div>

    <div class="board-container">

     <img class="board" src="/images/board.jpg">

   </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      gameId: null
    }
  },
  mounted () {
    this.gameId = this.$route.params.id
  }
}

</script>

<style lang="scss" scoped>
  @import '@/pages/css/gameplace.scss'
</style>