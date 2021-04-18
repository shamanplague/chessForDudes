import Vue from 'vue'

export const state = () => ({
  user: [],
  games: [],
  backendErrors: [],
  backendNotifications: []
})

export const actions = {
  SOCKET_tokenFromServer ({commit}, data) {
    
    Vue.$cookies.set('userToken', data.token)
    
    let userState = {
      isAnonymous: false,
      name: JSON.parse(atob(data.token.split('.')[1])).username
    }

    commit('setUser', userState)
  },
  SOCKET_anonymousTokenFromServer ({commit}, data) {
    Vue.$cookies.set('userToken', data.token)
    
    let userState = {
      isAnonymous: true
    }

    commit('setUser', userState)
  },
  SOCKET_gameList ({ commit }, data) {
    commit('refreshGameList', data.games)
  },
  
  SOCKET_gameManagenentData () {

  },
  SOCKET_startGame (store, data) {
    console.log('Прикатила игра', data)
  },
  SOCKET_activeGames () {
    
  },
  SOCKET_notificationFromServer ({ state, commit }, data) {
    data.id = state.backendErrors.length ?
     state.backendErrors[state.backendErrors.length-1].id + 1
     :
     0
    
    commit('addBackendNotification', data)
    setTimeout(() => {
      commit('deleteBackendNotification', data.id)
    }, 4000)
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
    }    
  },
  addBackendNotification (state, data) {
    state.backendNotifications.push(data)
  },
  deleteBackendNotification (state, id) {
    let neededNotification = state.backendNotifications.find(item => item.id === id)
    let index = state.backendNotifications.indexOf(neededNotification)
    if (index !== -1) {
      state.backendNotifications.splice(index, 1)
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