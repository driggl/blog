export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'Driggl Official',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~assets/sass/general.sass'],

  styleResources: {
    sass: [
      '~assets/sass/general.sass'
    ]
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/disqus'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],

  axios: {
    baseURL: 'https://api.driggl.com/v1/blogs/driggl'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    extend(config, ctx) {}
  },
  generate: {
    dir: 'public',
    routes: [
      "/blog",
      "/blog/a/from-activemodel-serializers-to-fast-jsonapi",
      "/blog/a/how-to-write-professional-commits-efficiently",
      "/blog/a/json-api-errors-handler",
      "/blog/a/how-much-your-time-is-worth",
      "/blog/a/adding-links-to-fast_jsonapi-serializer",
      "/blog/a/token-based-authorization",
      "/blog/a/delayed-jobs-with-sidekiq",
      "/blog/a/handling-exceptions-in-rails-applications",
      "/blog/a/should-you-start-using-vim",
      "/blog/a/how-squashing-commits-can-improve-your-git-workflow",
      "/blog/a/process-manager-vs-saga-confusion",
      "/blog/a/rework-review",
      "/blog/a/using-double-object-in-automatic-tests",
      "/blog/a/code-highlighting-with-rouge",
      "/blog/a/productivity-boost-with-postman",
      "/blog/a/git-hooks-commit-msg",
      "/blog/a/how-to-learn-web-development"
    ]
  }
};
