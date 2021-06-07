<template>

  <div class="grid-wrapper" :class="{ 'black-side' : !usersColorIsWhite }">
    <img class="board" src="/images/board.jpg">
    <div class="board-grid">
      <div v-for="cell in cells"
          :key="cell.label"
          class="cell"
          :class="[
          { 'selected' : cell.label === selectedCheckerCoordinate},
          { 'available' : availableMoves.includes(cell.label)}
          ]"
          :id="cell.label"
          @click="cell.checker ? chooseChecker(cell.label) : makeMove(cell.label)"
      >
        <div  v-if="cell.checker"
              class="checker"
              :class="{ 'white' : cell.checker.isWhite}"
              :style="!usersColorIsWhite ? 'transform: rotate(180deg)' : ''"
              @click.stop="chooseChecker(cell.label)"
        >
          <span class="king-mark">{{ cell.checker.isKing ? 'К' : '' }}</span>
        </div>
      </div>
    </div>
  </div>
  

</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'usersColorIsWhite', 'availableMoves', 'boardState' ],
  data () {
    return {
      selectedCheckerCoordinate: null
    }
  },
  mounted () {
    console.log('boardState', this.boardState)
  },
  watch : {
    
  },
  computed : {
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
      let checkerIsWhite = this.boardState.find(item => item.coordinate === coordinate).checker.isWhite
      if (this.usersColorIsWhite !== checkerIsWhite) return

      this.$emit('getAvailableMoves', coordinate )

      this.selectedCheckerCoordinate = coordinate
    },
    makeMove (id) {
      if (!this.selectedCheckerCoordinate) return
      if (this.selectedCheckerCoordinate === id) return

      this.$emit('makeMove', {
        from: this.selectedCheckerCoordinate,
        to: id
      })
      // this.selectedCheckerCoordinate = null
    }
  }
}

</script>

<style lang="scss" scoped>
@import 'ChessBoard.scss';
</style>