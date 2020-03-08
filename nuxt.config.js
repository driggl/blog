// process.env.DEBUG = 'nuxt:*'

export default {
  // debug: true,
  buildDir: 'public',
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head() {
    return {
      title: 'Driggl - Modern web development',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Build modern websites like a professional with Driggl Community!'
        },
        {
          property: "fb:app_id",
          value: process.env.FB_APP_ID
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: "canonical",
          href: "https://driggl.com" + this.$route.path
        }
      ]
    }
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

  buildModules: [
    ['@nuxtjs/google-analytics', {
      id: process.env.GA_UA
    }],
    // With options
    ['@nuxtjs/global-components', { /* module options */ }]
  ],
  axios: {
    // proxy: true
    baseURL: 'https://api.sourcerio.com/v1/blogs/driggl'
  },
  // proxy: {
  //   '/api/': {
  //     target: process.env.API_URL || '',
  //     pathRewrite: { '^/api': '' }
  //   }
  // },

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
    }
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
  },
  env: {
    GA_UA: process.env.GA_UA,
    FB_APP_ID: process.env.FB_APP_ID
  }
};
