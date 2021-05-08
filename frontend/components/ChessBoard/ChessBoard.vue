<template>

  <div class="grid-wrapper">
    <img class="board" src="/images/board.jpg">
    <div class="board-grid">
      <div v-for="cell in cells"
          :key="cell.label"
          class="cell"
          :class="{ 'selected' : cell.label === selectedCheckerCoordinate}"
          :id="cell.label"
          @click="makeMove(cell.label)"
      >
      <div  v-if="cell.checker"
            class="checker"
            :class="{ 'white' : cell.checker.isWhite}"
            @click.stop="chooseChecker(cell.label)"
            ></div>
      </div>
    </div>
  </div>
  

</template>

<script>

import _ from 'lodash'

export default {
  props: ['boardState'],
  data () {
    return {
      selectedCheckerCoordinate: null
    }
  },
  watch : {
    selectedCheckerCoordinate (v) {
      console.log('selectedCheckerCoordinate', v)
    }
  },
  computed : {
    cells () {
      // if (!this.boardState) return []

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
    chooseChecker (coordinate) {
      this.selectedCheckerCoordinate = coordinate
    },
    makeMove (id) {
      this.$emit('makeMove', {
          from: this.selectedCheckerCoordinate,
          to: id
        }) 
    }
  }
}

</script>

<style lang="scss" scoped>
@import 'ChessBoard.scss';
</style>