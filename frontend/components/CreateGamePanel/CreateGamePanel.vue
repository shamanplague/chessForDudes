<template>

  <div class="create-game-panel">
    <div>
      <span>Создать игру</span>
    </div>
    <b-form-select
      v-model="gameType"
      :options="gameTypes"
      class="custom-select-sm"
      value-field="value"
      text-field="name"
      disabled-field="disabled"
    ></b-form-select>
    <div>
      <div class="create-game-panel__button-wrapper">
        <button @click="createGame()" type="button" class="btn btn-sm">Создать</button>
      </div>
    </div>
  </div>

</template>

<script>

import _ from 'lodash'

export default {
  data () {
    return {
      gameTypes: [
        {name: 'Шашки', value: 'checkers', disabled: false},
        {name: 'Шахматы', value: 'chess', disabled: true}
      ],
      gameType: 'checkers'
    }
  },
  methods : {
    createGame () {
      this.$socket.emit('createGame', {})
    }
  }
}

</script>

<style lang="scss" scoped>
@import 'CreateGamePanel.scss';
</style>