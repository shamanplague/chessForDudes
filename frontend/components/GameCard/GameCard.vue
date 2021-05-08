<template>

  <div class="game-item">
        <div class="game-item__line"></div>
        <div class="game-item__id">#{{ game.id }}</div>
        <div class="game-item__type">
          <span>Тип игры:</span>
          <span>Шашки</span>
        </div>
        <div class="game-item__hoster">
          <span>Создатель: </span>
          <span>{{ game.myGame ? 'Вы' : defineUsername(game.hoster) }}</span>
        </div>
        <div class="game-item__players">
          <span>Игроки: </span>
          <span>{{ game.players.map(item => defineUsername(item)).join(', ') }}</span>
        </div>
        <div class="game-item__spectrators">
          <span>Наблюдатели: </span>
          <span>{{ game.spectrators.map(item => defineUsername(item)).join(', ') }}</span>
        </div>
        <div class="game-item__buttons">
          <div v-if="game.myGame" class="game-item__button-wrapper">
            <button @click="deleteGame(game.id)" type="button" class="btn btn-sm">Отменить</button>
          </div>
          <div v-if="game.myGame" class="game-item__button-wrapper">
            <button @click="startGame(game.id)" type="button" class="btn btn-sm" :disabled="!gameStartAvailable">Начать</button>
          </div>
          <div v-if="!game.myGame && !game.forPlaying" class="game-item__button-wrapper">
            <button @click="joinGame(game.id, true)" type="button" class="btn btn-sm" :disabled="!enterAsPlayerAvailable">Войти</button>
          </div>
          <div v-if="!game.myGame && game.forPlaying" class="game-item__button-wrapper">
            <button @click="exitGame(game.id, true)" type="button" class="btn btn-sm">Выйти</button>
          </div>
          <div v-if="!game.myGame && !game.forSpectrating" class="game-item__button-wrapper">
            <button @click="joinGame(game.id, false)" type="button" class="btn btn-sm" :disabled="!enterAsSpectratorAvailable">Наблюдать</button>
          </div>
          <div v-if="!game.myGame && game.forSpectrating" class="game-item__button-wrapper">
            <button @click="exitGame(game.id, false)" type="button" class="btn btn-sm">Не наблюдать</button>
          </div>
        </div>
      </div>

</template>

<script>

import _ from 'lodash'
import ServerEvents from '@/websockets/server-events'

export default {
  data () {
    return {

    }
  },
  props: ['game'],
  mounted () {
    console.log('game', this.game)
  },
  computed: {
    enterAsSpectratorAvailable () {
      return !this.game.forPlaying
    },
    enterAsPlayerAvailable () {
      return this.game.players.length < 2 && !this.game.forSpectrating
    },
    gameStartAvailable () {
      return this.game.players.length === 2
    }
  },
  methods: {
    defineUsername (username) {
      if (username === 'anonymous') {
        return 'Аноним'
      } else if (username === 'self') {
        return 'Вы'
      } else {
        return username
      }
    },
    exitGame (id, isPlayer) {
      this.$socket.emit(ServerEvents.LEAVE_GAME, {
        game_id: id,
        isPlayer
      })
    },
    startGame (id) {
      this.$socket.emit(ServerEvents.START_GAME, {
        game_id: id
      })
    },
    joinGame (id, asPlayer) {
      this.$socket.emit(ServerEvents.JOIN_GAME, {
        game_id: id,
        asPlayer
      })
    },
    deleteGame (id) {
      this.$socket.emit(ServerEvents.DELETE_GAME, {
        game_id: id
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import 'GameCard.scss';
</style>