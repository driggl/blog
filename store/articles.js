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

    const { data } = await this.$axios.$get("/articles", {
      params: { page, per_page: state.perPage }
    })
    // const data = [
    //   {
    //     id: "1",
    //     attributes: {
    //       slug: "handling-errors-rails",
    //       title: "Handling Errors in ruby on Rails API applications",
    //       category: "Web development",
    //       excerpt:
    //         "If you struggle with the correct way of handling errors \
    //         in Rails Applications, this article is a solution for all \
    //         your problems"
    //     },
    //     relationships: {
    //       author: {
    //         data: {
    //           type: "users",
    //           id: "1"
    //         }
    //       }
    //     }
    //   }
    // ]
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

  // async getArticle({ getters, commit, state, rootGetters }, selectedId) {
  //   const article = getters.articles && getters.articles.get(selectedId)

  //   if (article) {
  //     commit('SET', [article])
  //     commit('SELECT', article)
  //     return state.selected
  //   }

  //   const { data, included } = await this.$repositories.articles.show(
  //     selectedId
  //   )
  //   commit('SELECT', data)

  //   const category = included.find((resource) => resource.type === 'categories')

  //   if (category) {
  //     commit('categories/SET', [category], {
  //       root: true
  //     })
  //   }

  //   return state.selected
  // }
}
