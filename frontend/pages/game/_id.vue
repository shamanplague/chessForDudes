<template>
  <div>

    <div class="play-header-wrapper mt-3 mb-3">
      <PlayHeader :isMyMove.sync="isMyMove"/>
    </div>

    <div class="board-wrapper">
      <Board  v-if="activeGame"
              :usersColorIsWhite.sync="activeGame.usersColorIsWhite"
              :availableMoves.sync="availableMoves"
              :boardState.sync="activeGame.board"
              @makeMove="makeMove($event)" 
              @getAvailableMoves="getAvailableMoves($event)" 
      />
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
      gameId: null,
      availableMoves: []
    }
  },
  components : {
    PlayHeader,
    Board
  },
  sockets: {
    getAvailableMoves (v) {
      console.log('Приехали ходы на игре', v)
      this.availableMoves = v.moves
    }
  },
  mounted () {
    this.gameId = +this.$route.params.id
  },
  watch: {
    'activeGame.longMove.inProgress' (oldV, newV) {
      if (oldV && !newV) {
        console.log('Лонг мув начался')
      } else if (!oldV && newV) {
        console.log('Лонг мув законичлся')
        this.availableMoves = []
      }
    },
  },
  computed: {
    isLongMoveNow () {
      return this.activeGame.longMove.inProgress
    },
    activeGame () {
      // if (this.$store.state.activeGames[0]) {
      //   console.log('activeGame.usersColorIsWhite', this.$store.state.activeGames[0].usersColorIsWhite)
      // }
      console.log('Текущая игра', this.$store.state.activeGames.find(item => item.gameId === this.gameId))
      return this.$store.state.activeGames.find(item => item.gameId === this.gameId)
    },
    isMyMove () {
      if (!this.activeGame) return
      return this.activeGame.isNowWhiteMove === this.activeGame.usersColorIsWhite
    }
  },
  methods : {
    makeMove (coordinates) {

      if (!this.isLongMoveNow) {
        this.availableMoves = []
      }
      
      if (this.activeGame.longMove.inProgress) {
        coordinates.from = this.activeGame.longMove.moves[this.activeGame.longMove.moves.length - 1]
      }
      
      this.$socket.emit(ServerEvents.MAKE_MOVE, {
        gameId: this.gameId,
        coordinates
      })
    },
    getAvailableMoves (coordinate) {
      this.$socket.emit(ServerEvents.GET_AVAILABLE_MOVES, {
        gameId: this.gameId,
        coordinate
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '@/pages/css/gameplace.scss'
</style>