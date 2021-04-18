<template>
  <div>

    <div class="play-header-wrapper mt-3 mb-3">
      <PlayHeader />
    </div>

    <div class="board-wrapper">
      <Board />
    </div>

  </div>
</template>

<script>

import PlayHeader from '@/components/PlayHeader/PlayHeader'
import Board from '@/components/ChessBoard/ChessBoard'
export default {
  data () {
    return {
      gameId: null
    }
  },
  components : {
    PlayHeader,
    Board
  },
  // sockets : {

  // },
  mounted () {
    this.gameId = this.$route.params.id
  },
  methods : {
    
  }
}

</script>

<style lang="scss" scoped>
  @import '@/pages/css/gameplace.scss'
</style>