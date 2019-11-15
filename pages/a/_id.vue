<template>
  <div>
    <top-nav />
    <div class="container main">
      <div class="columns">
        <div class="column is-two-third-tablet">
          <section class="header">
            <h1 class="title is-4">
              {{ selected.attributes.title }}
            </h1>
          </section>
        </div>
        <aside class="column is-one-third-tablet">
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
</template>

<script>
import { mapGetters } from "vuex";
import TopNav from "~/components/organisms/TopNav";

import EmailSubscriptionForm from "~/components/molecules/EmailSubscriptionForm";

export default {
  components: {
    EmailSubscriptionForm,
    TopNav
  },
  computed: {
    ...mapGetters("articles", ["selected"])
  },
  async fetch({ app, route }) {
    await app.store.dispatch("articles/getArticle", route.params.id);
  }
};
</script>

<style lang="sass">
.header
  padding: 40px 0
</style>
