export const state = () => ({
  articles: new Map(),
  pages: 0,
  perPage: 5,
  allLoaded: false,
  selected: null
})

export const mutations = {
  SET(state, payload) {
    payload.forEach((article) => {
      state.articles.set(article.id, article)
    })
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
    { type, blogId } = { type: 'first', blogId: null }
  ) {
    let page
    if (blogId != null) {
      type = 'first'
    }

    if (type === 'first') {
      page = 1
    } else if (type === 'next') {
      page = state.pages + 1
    }

    // const { data, links } = await this.$repositories.articles.index({
    //   page,
    //   perPage: state.perPage,
    // })

    const { data } = await this.$axios.$get("/articles")
    // commit('users/SET_USERS', included.filter(({ type }) => type === 'user'), {
    //   root: true
    // })

    // if (!links.next) {
    //   commit('LOAD_ALL', true)
    // }

    commit('SET', data)
    // commit('INCREASE_PAGES')

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
