import Vue from 'vue'

export const state = () => ({
  user: [],
  games: [],
  backendErrors: [],
})

export const actions = {
  SOCKET_tokenFromServer ({commit}, data) {
    
    Vue.$cookies.set('userToken', data.token)
    
    let userState = {
      isAnonymous: false,
      name: JSON.parse(atob(data.token.split('.')[1])).username
    }

    commit('setUser', userState)
    // console.log('on SOCKET_sendTokenFromServer method', data)
  },
  SOCKET_anonymousTokenFromServer ({commit}, data) {
    Vue.$cookies.set('userToken', data.token)
    
    let userState = {
      isAnonymous: true
    }

    commit('setUser', userState)
    // console.log('on SOCKET_sendTokenFromServer method', data)
  },
  SOCKET_gameList ({ commit }, data) {

    // console.log('data on refreshGameList', data)

    // console.log('Vue.$socket', Vue.$socket)

    commit('refreshGameList', data.games)
  },
  
  SOCKET_gameManagenentData () {

  },
  SOCKET_exception  ({ state, commit }, data) {
    data.id = state.backendErrors.length ?
     state.backendErrors[state.backendErrors.length-1].id + 1
     :
     0

    commit('addBackendError', data)
    setTimeout(() => {
      commit('deleteBackendError', data.id)
    }, 2000)
  },
  deleteBackendError ({ commit }, id) {
    commit('deleteBackendError', id)
  },
  replaceUsername({ commit }, id) {
    commit('deleteBackendError', id)
  }
}

export const mutations = {
  refreshGameList (state, data) {
    state.games = data
  },
  addBackendError (state, data) {    
    state.backendErrors.push(data)
  },
  deleteBackendError (state, id) {
    let neededError = state.backendErrors.find(item => item.id === id)
    let index = state.backendErrors.indexOf(neededError)
    if (index !== -1) {
      state.backendErrors.splice(index, 1)
      // console.log(`Удалили ошибку ${id}`)
    }    
  },
  setUser (state, data) {
    state.user = data
  },
  replaceUsername({ games, user}, data) {

    let neededGame = games.find(item => item.id === data.gameId)
    let username = user.isAnonymous ? 'anonymous' : user.name
    let index = neededGame[data.field].indexOf(username)

    neededGame[data.field].splice(index, 1)
    neededGame[data.field].unshift('self')
  }
}