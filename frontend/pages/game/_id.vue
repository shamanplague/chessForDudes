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
    // console.log('Делаем анонимный токен')
    // this.loginAsAnonymous()
  },
  methods : {
    // startGame () {
    //   console.log('Кидаем месседж на старт игры')
    //   this.$socket.emit('startGame')
    // },
    // loginAsAnonymous () {
    //   this.$socket.emit('login', {
    //     username: 'anonymous',
    //     password: 'anonymous',
    //     isAnonymous: true
    //   })
    // }
  }
}

</script>

<style lang="scss" scoped>
  @import '@/pages/css/gameplace.scss'
</style>