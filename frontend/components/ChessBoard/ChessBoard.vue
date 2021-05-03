<template>

  <div class="grid-wrapper">
    <img class="board" src="/images/board.jpg">
    <div class="board-grid">
      <div v-for="cell in cells"
          :key="cell.label"
          class="cell"
          :id="cell.label"
      >
      <div  v-if="cell.checker"
            class="checker"
            :class="{ 'white' : cell.checker.isWhite}"
            ></div>
      </div>
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
    boardState () {
      if (!this.$store.state.activeGames.length) return []
      // console.log('boardState', this.$store.state.activeGames[0].board)
      return this.$store.state.activeGames[0].board
    },
    cells () {
      let arr = []

      let letterGen = (function* func () {
        let index = 0
        let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        while(true) {
          yield letters[index++]
          if (index === letters.length) index = 0
        }
      })()

      let numberGen = (function* func () {
        let iteration = 1
        let index = 8
        while(true) {
          yield index
          iteration++
          if (iteration > 8) {
            index--
            iteration = 1
          }
        }
      })()

      for (let i = 0; i < 64; i++) {
        // console.log('id', `${letterGen.next().value}${numberGen.next().value}`)
        let object = 
        arr.push({id: i, label: `${letterGen.next().value}${numberGen.next().value}`})
      }

      arr.map(cellItem => {

        let statesCell = this.boardState.find(boardItem => boardItem.coordinate === cellItem.label)

        if (statesCell && statesCell.hasOwnProperty('checker')) {
          cellItem.checker = statesCell.checker
        }

        return cellItem
      })

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