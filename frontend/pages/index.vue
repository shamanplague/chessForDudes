<template>
  <div>
    <h1>Main page</h1>
    <button @click="func()">
      Реконнект
    </button>
    <button @click="startGameAsAnonymous()">
      Получить анонимный токен
    </button>
    <button @click="createGame()">
      Начать игру
    </button>
  </div>
</template>

<script>

import VueSocketIO from 'vue-socket.io'

export default {
  data () {
    return {
      VueSocketIO
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
    }
  },
  methods : {
    func (message) {
      this.$socket.disconnect()
      this.$socket.connect()
    },
    startGameAsAnonymous () {
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
