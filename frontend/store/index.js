import Vue from 'vue'

export const state = () => {
  let games = []
}

export const actions = {
  SOCKET_tokenFromServer ({state}, data) {
    Vue.$cookies.set('userToken', data.token)
    
    console.log('on SOCKET_sendTokenFromServer method', data)
  },
  SOCKET_gameList ({ state }, data) {
    state.games = data
    console.log('current games', state.games)
  }
}