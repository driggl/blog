export const state = () => ({
  articles: new Map(),
  pages: 0,
  perPage: 5,
  allLoaded: false,
  selected: null
})

export const mutations = {
  SET(state, payload) {
    const articles = new Map(state.articles)
    payload.forEach((article) => {
      articles.set(article.id, article)
    })
    state.articles = articles
  },
  ADD_INCLUDED_USERS(state, users) {
    state.includedUsers.push(...users)
  },
  SELECT(state, newArticle) {
    state.selected = newArticle
  },
  INCREASE_PAGES(state) {
    state.pages += 1
  },
  LOAD_ALL(state, payload) {
    state.allLoaded = payload
  }
}

export const getters = {
  articles: ({ articles }) => articles,
  selected: ({ selected }) => selected,
  pages: ({ pages }) => pages,
  allLoaded: ({ allLoaded }) => allLoaded
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

    try {
      const { data, links, included } = await this.$axios.$get("/articles", { params: { "page[number]": page, "page[size]": 10 } })
      if (!links.next) {
        commit('LOAD_ALL', true)
      }

      commit('SET', data)

      commit('authors/SET', included.filter(({ type }) => type === 'authors'), { root: true})

    } catch(err) {
      commit('SET', [])
      commit('LOAD_ALL', true)
    }

    commit('INCREASE_PAGES')

    return state.articles
  },

  async getArticle({ getters, commit, state }, selectedId) {
    const article = Array.from(getters.articles).map((article) => article[1])
      .find((article) => article.attributes.slug === selectedId)

    if (article) {
      commit('SELECT', article)
      return state.selected
    }
    try {
      const { data, included } = await this.$axios.$get(`/articles/${selectedId}`)
      commit('SET', [data])
      commit('SELECT', data)
      commit('authors/SET', included.filter(({ type }) => type === 'authors'), { root: true})
    } catch (err) {
      commit('SET', [])
      commit('SELECT', null)
    }

    return state.selected
  }
}
