<template>
  <div>
    <h1>Main page</h1>
    <div class="buttons">
      <button @click="getGameList()">
        Получить список игр
      </button>
      <button @click="createGame()">
        Создать игру
      </button>
    </div>

    <div class="lobby">
      <div v-for="game in filteredGameList" :key="game.id">
        <span>{{ game.id }}</span>
        <span>{{ game.status }}</span>
        <span>{{ game.hoster }}</span>
        <button v-if="game.myGame" @click="deleteGame(game.id)">
          Отменить
        </button>
        <button v-if="game.myGame" @click="startGame(game.id)">
          Начать игру
        </button>
        <button v-if="!game.myGame && !game.forPlaying" @click="joinGame(game.id, true)">
          Войти
        </button>
        <button v-if="!game.myGame && game.forPlaying" @click="exitGame(game.id, true)">
          Выйти
        </button>
        <button v-if="!game.myGame && !game.forSpectrating" @click="joinGame(game.id, false)">
          Наблюдать
        </button>
        <button v-if="!game.myGame && game.forSpectrating" @click="exitGame(game.id, false)">
          Не наблюдать
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import _ from 'lodash'

export default {
  data () {
    return {
      filteredGameList: []
    }
  },
  sockets : {
    connect () {
      console.log('Соккеты подцепились')
    },
    tokenFromServer () {
      setTimeout(() => {
        this.$socket.disconnect()
        this.$socket.connect()
      }, 300)
    },
    anonymousTokenFromServer () {
      setTimeout(() => {
        this.$socket.disconnect()
        this.$socket.connect()
      }, 300)
    },
    gameManagenentData (v) {
      console.log('gameManagenentData', v)
      this.filteredGameList = this.newFilteredGameList
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

        return item
      })
    }
  },
  mounted() {
    // let cookieToken = Vue.$cookies.get('userToken')
    // if (!cookieToken) {
      console.log('Делаем анонимный токен')
      this.loginAsAnonymous()
      // console.log('Заходим как Garfield')
      // this.loginAsGarfield()
    // }
  },
  watch : {
    gameList (v) {
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
    exitGame () {
      console.log('Выходим из игры')
    },
    startGame (id) {
      this.$socket.emit('startGame', {
        game_id: id
      })
    },
    // deleteError (id) {
    //   this.$store.dispatch('deleteBackendError', id)
    // },
    getGameList () {
      this.$socket.emit('gameList')
      // setTimeout(() => {
      //   console.log('this.$store.state.games', this.$store.state.games)
      // }, 500)
    },
    createGame () {
      this.$socket.emit('createGame', {})
    },
    joinGame (id, asPlayer) {
      this.$socket.emit('joinGame', {
        game_id: id,
        asPlayer
      })
    },
    deleteGame (id) {
      this.$socket.emit('deleteGame', {
        game_id: id
      })
    },
    loginAsAnonymous () {
      this.$socket.emit('login', {
        username: 'anonymous',
        password: 'anonymous',
        isAnonymous: true
      })
    },
    loginAsGarfield () {
      this.$socket.emit('login', {
        username: 'garfield',
        password: 'garfield',
        isAnonymous: false
      })
    }
  }
}
</script>

<style>

</style>
