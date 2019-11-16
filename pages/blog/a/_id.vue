<template>
  <div>
    <top-nav />
    <section
      class="hero"
      :style="{
        'background-image': 'url(' + selected.attributes.thumbnail.full + ')'
      }"
    >
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            {{ selected.attributes.title }}
          </h1>
        </div>
      </div>
    </section>
    <div class="section main">
      <div class="container">
        <div class="columns">
          <div class="column is-hidden-touch is-one-quarter-desktop" />
          <div class="column is-two-third-tablet is-one-half-desktop">
            <div class="article-meta">
              <span>Category: </span><strong>Web development</strong>
              <span>Author: </span><strong>Sebastian Wilgosz</strong>
            </div>
            <div
              class="content is-spaced"
              v-html="selected.attributes.content"
            />
            <div class="comments">
              <vue-disqus
                shortname="driggl"
                :identifier="'article-' + selected.id"
                :url="'https://driggl.com/blog/a/' + selected.slug"
                :title="selected.title"
              />
            </div>
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

<style scoped lang="sass">
.main
  padding: 40px 0
  .content
    padding-top: 30px

.hero
  height: 400px
  background-position: center
  .container
    max-width: 700px
    margin: auto
    display: flex
    flex-direction: column
    height: 100%;
    justify-content: center
    .title, .subtitle
      color: $white
.hero-body
  background-color: rgba(0,0,0,0.75)

</style>
