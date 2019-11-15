<template>
  <div>
    <top-nav />
    <div class="container">
      <div class="container main">
        <div class="columns">
          <div class="column is-two-third-tablet is-three-quarters-desktop">
            <h2 class="title is-4">
              Recently on Driggl
            </h2>

            <article-list :articles="articles" />
          </div>
          <aside class="column is-one-third-tablet is-one-quarter-desktop">
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
          </aside>
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

