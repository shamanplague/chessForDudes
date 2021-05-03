<template>
  <div>

    <div class="play-header-wrapper mt-3 mb-3">
      <PlayHeader />
    </div>

    <div class="board-wrapper">
      <Board @makeMove="makeMove($event)" />
    </div>

  </div>
</template>

<script>

import PlayHeader from '@/components/PlayHeader/PlayHeader'
import Board from '@/components/ChessBoard/ChessBoard'
import ServerEvents from '@/websockets/server-events'

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
  mounted () {
    this.gameId = this.$route.params.id
  },
  methods : {
    makeMove (coordinates) {
      this.$socket.emit(ServerEvents.MAKE_MOVE, {
        gameId: this.gameId,
        coordinates
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '@/pages/css/gameplace.scss'
</style>