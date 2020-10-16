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
    '~/plugins/disqus',
    { src: '@/plugins/infinite-loading', mode: 'client' },
    '~/plugins/optinmonster'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    ['nuxt-facebook-pixel-module', {
      /* module options */
      track: 'PageView',
      pixelId: process.env.FB_PIXEL_ID,
      disabled: (process.env.NODE_ENV == 'development')
    }],
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
    baseURL: process.env.BLOG_API_URL
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
    extend(config, ctx) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    },
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    }
  },

  env: {
    GA_UA: process.env.GA_UA,
    FB_APP_ID: process.env.FB_APP_ID,
    BLOG_API_URL: process.env.BLOG_API_URL
  }
};
