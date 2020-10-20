<template>
  <div>
    <top-nav />
    <div class="container">
      <div class="container main">
        <div class="columns">
          <div class="cover social" style="display: none">
            <img src="/home-cover.jpg" />
          </div>
          <div class="column is-two-third-tablet is-three-quarters-desktop">
            <article-list :class="'section'" :articles="articles" />
            <!-- <client-only>
              <InfiniteLoading
                :distance="20"
                @infinite="onNextPage"
              >
                <template #no-more>
                  <email-subscription-form
                    :showLabel="false"
                    :placeholder="'Email'"
                    style="margin-bottom: 20px;"
                  />
                </template>
              </InfiniteLoading>
            </client-only> -->
          </div>
          <div class="column is-one-third-tablet is-one-quarter-desktop">
            <section class="section">
              <email-subscription-form />
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ArticleList from "~/components/organisms/ArticleList";
import InfiniteLoading from "vue-infinite-loading";
import DglLoader from "~/components/atoms/DglLoader.vue";
import Logo from "~/components/Logo.vue";
import TopNav from "~/components/organisms/TopNav";

export default {
  name: "Articles",
  components: {
    ArticleList,
    DglLoader,
    InfiniteLoading,
    Logo,
    TopNav
  },
  head: {
    title: "Recent Articles",
    titleTemplate: "%s | Driggl - Modern web development",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Build modern websites like a professional with Driggl's Community!",
        titleTemplate: null
      },
      {
        hid: "author",
        name: "author",
        content: "Driggl - https://driggl.com"
      },
      {
        property: "og:title",
        content: "Recent articles",
        vmid: "og:title"
      },
      {
        property: "og:description",
        content:
          "Newest content from web Professionals and the Modern web development Community!",
        vmid: "og:description"
      },
      {
        property: "og:image",
        content: "/home-cover.jpg",
        vmid: "og:image"
      },
      {
        property: "og:type",
        content: "website"
      }
    ]
  },
  computed: {
    ...mapGetters("articles", ["articles", "allLoaded"])
  },
  async fetch({ app, error }) {
    if (app.store.getters["articles/pages"] > 0) {
      return;
    }
    await app.store.dispatch("articles/getPage", { type: "first" });
  },
  methods: {
    async onNextPage($state) {
      await this.getNextPage();

      if (this.allLoaded) {
        $state.complete();
      } else {
        $state.loaded();
      }
    },
    getNextPage(type) {
      return this.$store.dispatch("articles/getPage", { type: "next" });
    }
  }
};
</script>
