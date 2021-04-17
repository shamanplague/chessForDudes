import Vue from 'vue'
import { wrapFunctional } from './index'

const components = {
  ChessBoard: () => import('../..\\components\\ChessBoard\\ChessBoard.vue' /* webpackChunkName: "components/chess-board" */).then(c => wrapFunctional(c.default || c)),
  CreateGamePanel: () => import('../..\\components\\CreateGamePanel\\CreateGamePanel.vue' /* webpackChunkName: "components/create-game-panel" */).then(c => wrapFunctional(c.default || c)),
  GameCard: () => import('../..\\components\\GameCard\\GameCard.vue' /* webpackChunkName: "components/game-card" */).then(c => wrapFunctional(c.default || c)),
  HeaderNav: () => import('../..\\components\\HeaderNav\\HeaderNav.vue' /* webpackChunkName: "components/header-nav" */).then(c => wrapFunctional(c.default || c)),
  PlayHeader: () => import('../..\\components\\PlayHeader\\PlayHeader.vue' /* webpackChunkName: "components/play-header" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
