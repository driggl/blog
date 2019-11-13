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
          <a class="navbar-item">
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
            <h2 class="title is-4">
              Recently on Driggl
            </h2>
          </section>

          <article-list :articles="articles" />
        </div>
        <aside class="column is-one-third-tablet">
          <section class="header">
            <h2 class="title is-4">
              Do you like this content?
            </h2>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "~/components/Logo.vue";
import ArticleList from "~/components/organisms/ArticleList";

export default {
  components: {
    ArticleList,
    Logo
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

<style>
.header {
  padding: 40px 0;
}
</style>