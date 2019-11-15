<template>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <logo />
        </a>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarTop"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarTop" class="navbar-menu">
        <div class="navbar-start"></div>

        <div class="navbar-end">
          <a class="navbar-item" href="https://driggl.com/#courses">
            Courses
          </a>

          <a
            href="https://patreon.com/driggl"
            class="navbar-item"
            target="_bank"
          >
            Support
          </a>
        </div>
      </div>
    </nav>
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
import Logo from "~/components/Logo.vue";
import EmailSubscriptionForm from "~/components/molecules/EmailSubscriptionForm";

export default {
  components: {
    EmailSubscriptionForm,
    Logo
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
