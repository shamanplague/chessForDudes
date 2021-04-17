<template>

  <div class="board-container">
    <img class="board" src="/images/board.jpg">
    <div class="board-grid">
      <div v-for="cell in cells"
          :key="cell"
          class="cell" 
      ></div>
    </div>
  </div>

</template>

<script>

import _ from 'lodash'

export default {
  data () {
    return {
      
    }
  },
  computed : {
    cells () {
      let arr = []
      for (let i = 0; i < 64; i++) {
        arr.push(i)
      }

      console.log('arr.length', arr.length)

      return arr
    }
  },
  methods : {
    
  }
}

</script>

<style lang="scss" scoped>
@import 'ChessBoard.scss';
</style>