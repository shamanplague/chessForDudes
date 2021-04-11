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
        <!-- <button @click="joinGame(game.id)" :disabled="game.myGame"> -->
        <button @click="joinGame(game.id, true)">
          Войти
        </button>
        <button @click="joinGame(game.id, false)">
          Наблюдать
        </button>
      </div>
    </div>

    {{ user }}

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
    gameCreatedByUser (v) {
      console.log('gameCreatedByUser', v)
      this.filteredGameList = this.newFilteredGameList
      .map(item => {
        if (v.games.includes(item.id)) {
          item.myGame = true
        } else {
          item.myGame = false
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
      this.newFilteredGameList = v
      this.$socket.emit('gameCreatedByUser')
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
    joinGame (id, asPlayer) {
      this.$socket.emit('joinGame', {
        game_id: id,
        asPlayer
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
    },
    createGame () {
      this.$socket.emit('createGame', {})
    }
  }
}
</script>

<style>

</style>
