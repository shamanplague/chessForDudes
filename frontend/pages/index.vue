<template>
  <div>

    <div class="create-game-panel-wrapper">
      <CreateGamePanel />
    </div>

    <div v-if="isGamesLoading" class="spinner-container vw-100 text-center pt-3">
      <b-spinner variant="primary"></b-spinner>
    </div>

    <div v-else-if="filteredGameList.length" class="game-list">
    
    <GameCard 
      class="mt-1 mb-2"
      v-for="game in filteredGameList"
      :key="game.id"
      :game="game"
    />

    </div>
    <div v-else class="spinner-container vw-100 text-center pt-3">
      <span>Пока не создано ни одной игры</span>
    </div>

  </div>
</template>

<script>

import _ from 'lodash'
import GameCard from '@/components/GameCard/GameCard'
import CreateGamePanel from '@/components/CreateGamePanel/CreateGamePanel'
import ServerEvents from '@/websockets/server-events'

export default {
  data () {
    return {
      isGamesLoading: true,
      filteredGameList: []
    }
  },
  components : {
    GameCard,
    CreateGamePanel
  },
  sockets : {
    connect () {
      console.log('Соккеты подцепились', ServerEvents)
    },
    startGame (data) {
      console.log('для пуша', data)
      this.$router.push({ path: `/game/${data.new_game.gameId}` })
    },
    backgroundNotificationFromServer (data) {
      console.log('Упало фоновое с бэка', data)
    },
    tokenFromServer () {
      setTimeout(() => {
        this.$socket.disconnect()
        this.$socket.connect()
      }, 300)
      setTimeout(() => {
        this.getGameList()
      }, 600)
    },
    anonymousTokenFromServer () {
      setTimeout(() => {
        this.$socket.disconnect()
        this.$socket.connect()
      }, 300)
      setTimeout(() => {
        this.getGameList()
      }, 600)
    },
    gameManagenentData (v) {
      // console.log('gameManagenentData', v)
      this.filteredGameList = _.orderBy(this.newFilteredGameList
      .map(item => {
        item.myGame = v.created_games.includes(item.id)
        item.forPlaying = v.joined_games.includes(item.id)
        item.forSpectrating = v.spectrated_games.includes(item.id)

        if (item.forPlaying) {
          this.$store.commit('replaceUsername', {gameId: item.id, field: 'players'})
        }

        if (item.forSpectrating) {
          this.$store.commit('replaceUsername', {gameId: item.id, field: 'spectrators'})
        }

        return item
      }), 'id', 'desc')
    },
    activeGames () {
      
    }
  },
  mounted() {
    // let cookieToken = Vue.$cookies.get('userToken')
    let roleToken = this.$cookies.get('role')

    console.log('roleToken', roleToken)

    if (roleToken === 'garfield') {
      this.loginAsGarfield()
    } else if (roleToken === 'john') {
      this.loginAsJohn()
    } else if (roleToken === 'liz') {
      this.loginAsLiz()
    } else if (roleToken === 'odie') {
      this.loginAsOdie()
    } else {
      this.loginAsAnonymous()
    }
    // if (!cookieToken) {
      // console.log('Делаем анонимный токен')
      // this.loginAsAnonymous()
      // console.log('Заходим как Garfield')
      // this.loginAsGarfield()
    // }
  },
  watch : {
    gameList (v) {
      this.isGamesLoading = false
      if (this.user.isAnonymous) {
        this.newFilteredGameList = v
        this.$socket.emit(ServerEvents.GAME_MANAGEMENT_DATA)
      } else {
        this.newFilteredGameList = v

        this.filteredGameList = _.orderBy(v
        .map(item => {
          
          item.myGame = item.hoster === this.user.name
          item.forPlaying = item.players.includes(this.user.name)
          item.forSpectrating = item.spectrators.includes(this.user.name)

          if (item.forPlaying) {
            this.$store.commit('replaceUsername', {gameId: item.id, field: 'players'})
          }

          if (item.forSpectrating) {
            this.$store.commit('replaceUsername', {gameId: item.id, field: 'spectrators'})
          }

          return item
        }), 'id', 'desc')
      }
    },
    filteredGameList (v) {
      // console.log('filteredGameList изменился', v)
    }
  },
  computed : {
    gameList () {
      return this.$store.state.games
    },
    user () {
      // console.log('this.$store.state.user', this.$store.state.user)
      return this.$store.state.user
    }
  },
  methods : {
    defineColor () {// корректно запрашивать для каждой игры
      this.$socket.emit(ServerEvents.DEFINE_COLOR, {
        gameId: this.gameId       
      })
    },
    // deleteError (id) {
    //   this.$store.dispatch('deleteBackendError', id)
    // },
    getGameList () {
      this.$socket.emit(ServerEvents.GAME_LIST)
      // setTimeout(() => {
      //   console.log('this.$store.state.games', this.$store.state.games)
      // }, 500)
    },
    loginAsAnonymous () {
      console.log('Заходим как аноним')
      this.$socket.emit(ServerEvents.LOGIN, {
        username: 'anonymous',
        password: 'anonymous',
        isAnonymous: true
      })
    },
    loginAsGarfield () {
      console.log('Заходим как Гарфилд')
      this.$socket.emit(ServerEvents.LOGIN, {
        username: 'garfield',
        password: 'garfield',
        isAnonymous: false
      })
    },
    loginAsJohn () {
      console.log('Заходим как Джон')
      this.$socket.emit(ServerEvents.LOGIN, {
        username: 'john',
        password: 'john',
        isAnonymous: false
      })
    },
    loginAsLiz () {
      console.log('Заходим как Лиз')
      this.$socket.emit(ServerEvents.LOGIN, {
        username: 'liz',
        password: 'liz',
        isAnonymous: false
      })
    },
    loginAsOdie () {
      console.log('Заходим как Оди')
      this.$socket.emit(ServerEvents.LOGIN, {
        username: 'odie',
        password: 'odie',
        isAnonymous: false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import 'css/index.scss'
</style>
