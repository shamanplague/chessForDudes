import Vue from 'vue'

export const state = () => ({
  games: [],
  gamesCreatedByUser: []
})

export const actions = {
  SOCKET_tokenFromServer ({state}, data) {
    Vue.$cookies.set('userToken', data.token)
    
    // console.log('on SOCKET_sendTokenFromServer method', data)
  },
  SOCKET_gameList ({ commit }, data) {

    // console.log('data on refreshGameList', data)

    console.log('Vue.$socket', Vue.$socket)

    commit('refreshGameList', data.games)
  },
  
  SOCKET_gameCreatedByUser ({ commit }, data) {

  },
}

export const mutations = {
  refreshGameList (state, data) {
    state.games = data
  },
}