<template>
  <div>
    <top-nav />
    <div class="container">
      <div class="container main">
        <div class="columns">
          <div class="column is-two-third-tablet is-three-quarters-desktop">
            <article-list :articles="articles" />
          </div>
          <div class="column is-one-third-tablet is-one-quarter-desktop">
            <section class="header">
              <h2 class="title is-4">
                Do you like this content?
              </h2>
              <p>
                <i
                  >Join to our Newsletter for weekly updates about new articles
                  and <strong>free programming tips!</strong></i
                >
              </p>
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
import EmailSubscriptionForm from "~/components/molecules/EmailSubscriptionForm";
import Logo from "~/components/Logo.vue";
import TopNav from "~/components/organisms/TopNav";

export default {
  name: "Articles",
  head: {
    title: "Recent Articles",
    titleTemplate: "%s | Driggl - Modern web development",
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Build modern websites like a professional with Driggl Community!",
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
        content: require("~/assets/home-cover.jpg"),
        vmid: "og:image"
      }
    ]
  },
  components: {
    ArticleList,
    EmailSubscriptionForm,
    Logo,
    TopNav
  },
  computed: {
    ...mapGetters("articles", ["articles"])
  },
  async fetch({ app, error }) {
    if (app.store.getters["articles/pages"] > 0) {
      return;
    }
    await app.store.dispatch("articles/getPage", { type: "first" });
  }
};
</script>
