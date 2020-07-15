export const state = () => ({
  authors: new Map(),
  selected: null
})

export const mutations = {
  SET(state, payload) {
    const authors = new Map(state.authors)
    payload.forEach((author) => {
      authors.set(author.id, author)
    })
    state.authors = authors
  },
  SELECT(state, author) {
    state.selected = author
  },
}

export const getters = {
  authors: ({ authors }) => authors,
  selected: ({ selected }) => selected
}

export const actions = {
  async getPage(
    { getters, commit, state },
    { type } = { type: 'first' }
  ) {

    if (state.allLoaded) {
      return state.articles
    }

    let page

    if (type === 'first') {
      page = 1
    } else if (type === 'next') {
      page = state.pages + 1
    }

    // const { data, links } = await this.$repositories.articles.index({
    //   page,
    //   perPage: state.perPage,
    // })
    try {
      const { data, links, included } = await this.$axios.$get("/articles", { params: { "page[number]": page } })
      if (!links.next) {
        commit('LOAD_ALL', true)
      }

      commit('SET', data)

      commit('users/SET', included.filter(({ type }) => type === 'user'), { root: true})

    } catch(err) {
      commit('SET', [])
      commit('LOAD_ALL', true)
    }

    commit('INCREASE_PAGES')

    return state.articles
  },

  async getArticle({ getters, commit, state }, selectedId) {

    // const { data, links } = await this.$repositories.articles.index({
    //   page,
    //   perPage: state.perPage,
    // })
    const article = Array.from(getters.articles).map((article) => article[1])
      .find((article) => article.attributes.slug === selectedId)

    if (article) {
      commit('SELECT', article)
      return state.selected
    }
    const { data } = await this.$axios.$get(`/articles/${selectedId}`)
    // commit('users/SET_USERS', included.filter(({ type }) => type === 'user'), {
    //   root: true
    // })

    commit('SET', [data])
    commit('SELECT', data)

    return state.selected
  }
}
