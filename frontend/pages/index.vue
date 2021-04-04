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
      <button @click="joinGame(1)">
        Войти в игру №1
      </button>
      <button @click="joinGame(2)">
        Войти в игру №2
      </button>
    </div>

    <div class="lobby">
      <div v-for="game in filteredGameList" :key="game.id">
        <span>{{ game.id }}</span>
        <span>{{ game.status }}</span>
        <span>{{ game.hoster }}</span>
        <span>{{ game.myGame }}</span>
      </div>
    </div>

  </div>
</template>

<script>

import Vue from 'vue'

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
      console.log('Катим тута')
      setTimeout(() => {
        this.$socket.disconnect()
        this.$socket.connect()
      }, 300)
    },
    gameCreatedByUser (v) {
      console.log('gameCreatedByUser', v)
      this.filteredGameList = this.filteredGameList
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
    let cookieToken = Vue.$cookies.get('userToken')
    if (!cookieToken) {
      this.loginAsAnonymous()
    }
  },
  watch : {
    gameList (v) {
      this.filteredGameList = v
      this.$socket.emit('gameCreatedByUser')
    }
  },
  computed : {
    gameList () {
      return this.$store.state.games
    }
  },
  methods : {
    getGameList () {
      this.$socket.emit('gameList')
      setTimeout(() => {
        console.log('this.$store.state.games', this.$store.state.games)
      }, 500)
    },
    joinGame (id) {
      this.$socket.emit('joinGameAsPlayer', {
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
    createGame () {
      this.$socket.emit('createGame', {})
    }
  }
}
</script>

<style>

</style>
