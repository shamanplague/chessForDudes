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
      console.log('Соккеты подцепились')
    },
    startGame (data) {
      // console.log('для пуша', data)
      this.$router.push({ path: `/game/${data.id}` })
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
      console.log('gameManagenentData', v)
      this.filteredGameList = _.orderBy(this.newFilteredGameList
      .map(item => {
        if (v.created_games.includes(item.id)) {
          item.myGame = true
        } else {
          item.myGame = false
        }

        if (v.joined_games.includes(item.id)) {
          item.forPlaying = true
        } else {
          item.forPlaying = false
        }

        if (v.spectrated_games.includes(item.id)) {
          item.forSpectrating = true
        } else {
          item.forSpectrating = false
        }

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
  mounted() {
    // let cookieToken = Vue.$cookies.get('userToken')
    let roleToken = this.$cookies.get('role')

    if (roleToken === 'garfield') {
      this.loginAsGarfield()
    } else if (roleToken === 'john') {
      this.loginAsJohn()
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
        this.$socket.emit('gameManagenentData')
      } else {
        this.newFilteredGameList = v

        this.filteredGameList = v
        .map(item => {
          console.log('item', item.players.includes(this.user.name))
          if (item.hoster === this.user.name) {
            item.myGame = true
          } else {
            item.myGame = false
          }

          if (item.players.includes(this.user.name)) {
            item.forPlaying = true
          } else {
            item.forPlaying = false
          }

          if (item.spectrators.includes(this.user.name)) {
            item.forSpectrating = true
          } else {
            item.forSpectrating = false
          }

          return item
        })
      }
    },
    filteredGameList (v) {
      console.log('filteredGameList изменился', v)
    }
  },
  computed : {
    gameList () {
      return this.$store.state.games
    },
    user () {
      console.log('this.$store.state.user', this.$store.state.user)
      return this.$store.state.user
    }
  },
  methods : {
    // deleteError (id) {
    //   this.$store.dispatch('deleteBackendError', id)
    // },
    getGameList () {
      this.$socket.emit('gameList')
      // setTimeout(() => {
      //   console.log('this.$store.state.games', this.$store.state.games)
      // }, 500)
    },
    loginAsAnonymous () {
      console.log('Заходим как аноним')
      this.$socket.emit('login', {
        username: 'anonymous',
        password: 'anonymous',
        isAnonymous: true
      })
    },
    loginAsGarfield () {
      console.log('Заходим как Гарфилд')
      this.$socket.emit('login', {
        username: 'garfield',
        password: 'garfield',
        isAnonymous: false
      })
    },
    loginAsJohn () {
      console.log('Заходим как Джон')
      this.$socket.emit('login', {
        username: 'john',
        password: 'john',
        isAnonymous: false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import 'css/index.scss'
</style>
