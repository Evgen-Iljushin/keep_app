export const state = () => ({
    darkMode: false,
    notifications: true,
    defaultLang: 'English',
    defaultCurrency: 'USD',
    defaultStartScreen: 'Active',
})

export const mutations = {
    switchDarkMode(state, value){
        state.darkMode = value
    },
    switchNotifications(state, value){
        state.notifications = value
    },
    switchCurrency(state, value){
        state.defaultCurrency = value
    },
    switchScreen(state, value){
        state.defaultStartScreen = value
    },
    switchLang(state, value){
        state.defaultLang = value
    }
}

export const actions = {
    async switchDarkMode({commit}, value){
        commit('switchDarkMode', value)
    },
    async switchNotifications({commit}, value){
        commit('switchNotifications', value)
    },
    async switchCurrency({commit}, value){
        commit('switchCurrency', value)
    },
    async switchScreen({commit}, value){
        commit('switchScreen', value)
    },
    async switchLang({commit}, value){
        commit('switchLang', value)
    }
}

export const getters = {
    darkMode: state => state.darkMode,
    notifications: state => state.notifications,
    defaultLang: state => state.defaultLang,
    defaultCurrency: state => state.defaultCurrency,
    defaultStartScreen: state => state.defaultStartScreen
}
