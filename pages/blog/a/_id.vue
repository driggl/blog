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
            <component :is="processedHtml" />
            <div class="comments">
              <vue-disqus
                shortname="driggl"
                :identifier="'article-' + selected.id"
                :url="'https://driggl.com/blog/a/' + selected.attributes.slug"
                :title="selected.attributes.title"
              />
            </div>
          </div>
          <aside class="column is-one-third-tablet is-one-quarter-desktop">
            <section class="header">
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
import CourseAd from "~/components/organisms/ads/CourseAd";
import CodeSnippet from "~/components/organisms/CodeSnippet";

export default {
  name: "SingleArticle",
  head() {
    return {
      title: this.selected.attributes.title,
      // titleTemplate: " %s | Driggl - Modern web development",
      meta: [
        {
          name: "twitter:site",
          content: "@drigglweb"
        },
        {
          name: "twitter:card",
          content: "summary_large_image"
        },
        {
          name: "twitter:creator",
          content: "@sebwilgosz"
        },
        {
          name: "twitter:title",
          content: this.selected.attributes.title
        },
        {
          name: "twitter:description",
          content: this.selected.attributes.excerpt
        },
        {
          name: "twitter:image",
          content: this.selected.attributes.thumbnail.sharing
        },
        {
          hid: "description",
          name: "description",
          content: this.selected.attributes.excerpt
        },
        {
          property: "og:title",
          content: this.selected.attributes.title
        },
        {
          property: "og:description",
          content: this.selected.attributes.excerpt
        },
        {
          property: "og:image",
          content: this.selected.attributes.thumbnail.sharing
        },
        {
          property: "og:image:width",
          content: 1200
        },
        {
          property: "og:image:height",
          content: 630
        },
        // {
        //   property: "og:url",
        //   content: "https://driggl.com" + this.$route.path
        // },
        {
          property: "og:type",
          content: "article"
        },
        {
          property: "fb:app_id",
          content: process.env.FB_APP_ID
        },
        {
          property: "article:author",
          content: "https://www.facebook.com/sebastian.wilgosz"
        },
        {
          property: "article:publisher",
          content: "https://www.facebook.com/driggl"
        },
        {
          property: "og:site_name",
          content: "Driggl - Modern Web Development"
        },
        {
          name: "author",
          content: "Sebastian Wilgosz"
        }
      ]
    };
  },
  data() {
    return { size: "small" };
  },
  components: {
    TopNav
  },
  computed: {
    ...mapGetters("articles", ["selected"]),
    html() {
      return this.selected.attributes.content;
    },
    processedHtml() {
      let html = this.html;
      let preContents = this.selected.attributes.content.match(
        /<pre[^>]*>.*?<\/pre>/gims
      );

      (preContents || []).forEach((preContent, index) => {
        html = html.replace(
          preContent,
          `<CodeSnippet :index="${index}" :text="html"/>`
        );
      });
      html = html
        .replace("{{", "<span>{</span><span>{</span>")
        .replace("}}", "<span>}</span><span>}</span>")
        .replace(
          "<p>[[EmailSubscriptionForm]]</p>",
          "<EmailSubscriptionForm />"
        )
        .replace(
          "<p>[[CourseAdAPI]]</p>",
          '<CourseAd :size="size" :bg="adBgColor" />'
        );
      return {
        components: {
          CourseAd,
          CodeSnippet
        },
        template: "<div class='content is-spaced'>" + html + "</div>",
        props: {
          html: {
            type: String,
            default: () => {
              return this.html;
            }
          },
          size: {
            type: String,
            default: () => {
              return "small";
            }
          },
          adBgColor: {
            type: String,
            default: () => {
              return "#efefef";
            }
          }
        }
      };
    }
  },
  async fetch({ app, route, redirect }) {
    if (route.path.indexOf("undefined") != -1) {
      return redirect(301, "/blog/a/why-we-are-not-dry");
    }

    await app.store
      .dispatch("articles/getArticle", route.params.id)
      .catch(() => {
        redirect(301, "/blog");
      });
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
    height: 100%
    justify-content: center
    .title, .subtitle
      color: $white

.hero-body
  background-color: rgba(0,0,0,0.75)
</style>
