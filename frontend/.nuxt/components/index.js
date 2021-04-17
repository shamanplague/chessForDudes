export { default as ChessBoard } from '../..\\components\\ChessBoard\\ChessBoard.vue'
export { default as CreateGamePanel } from '../..\\components\\CreateGamePanel\\CreateGamePanel.vue'
export { default as GameCard } from '../..\\components\\GameCard\\GameCard.vue'
export { default as HeaderNav } from '../..\\components\\HeaderNav\\HeaderNav.vue'
export { default as PlayHeader } from '../..\\components\\PlayHeader\\PlayHeader.vue'

export const LazyChessBoard = import('../..\\components\\ChessBoard\\ChessBoard.vue' /* webpackChunkName: "components/chess-board" */).then(c => wrapFunctional(c.default || c))
export const LazyCreateGamePanel = import('../..\\components\\CreateGamePanel\\CreateGamePanel.vue' /* webpackChunkName: "components/create-game-panel" */).then(c => wrapFunctional(c.default || c))
export const LazyGameCard = import('../..\\components\\GameCard\\GameCard.vue' /* webpackChunkName: "components/game-card" */).then(c => wrapFunctional(c.default || c))
export const LazyHeaderNav = import('../..\\components\\HeaderNav\\HeaderNav.vue' /* webpackChunkName: "components/header-nav" */).then(c => wrapFunctional(c.default || c))
export const LazyPlayHeader = import('../..\\components\\PlayHeader\\PlayHeader.vue' /* webpackChunkName: "components/play-header" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
export function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
