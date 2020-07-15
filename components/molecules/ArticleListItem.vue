<template>
  <div class="card">
    <nuxt-link :to="{ name: 'blog-a-id', params: { id: slug } }">
      <div class="columns">
        <div class="column is-half">
          <figure class="image">
            <img :src="imageUrl" alt="Placeholder image" />
          </figure>
        </div>
        <div class="card-content">
          <h3 class="title is-5">{{ title }}</h3>
          <article-meta-info :author="author" :links="false" />
          <div class="content">
            <p>{{ content }}</p>
          </div>
          <div class="level">
            <div class="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <a href="/" class="readmore">
                  read more...
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import ArticleMetaInfo from "~/components/atoms/ArticleMetaInfo";

export default {
  props: {
    authorId: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      // default: "https://via.placeholder.com/580x400"
      default: "https://via.placeholder.com/1080x780"
    },
    title: {
      type: String,
      required: true
    }
  },
  components: {
    ArticleMetaInfo
  },
  computed: {
    author() {
      return this.$store.getters['authors/authors'].get(this.authorId).attributes;
    }
  }
};
</script>

<style scoped>
.article-meta {
  font-size: 0.8rem;
  margin-top: -10px;
  margin-bottom: 20px;
}

.card {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 20px;
}

.card a {
  color: #444444;
}
.card .readmore {
  color: #e89b4b;
  text-decoration: underline;
}

.card:hover .readmore {
  color: #bd6f2b;
}

.card-image {
  max-width: 50%;
}

.card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}
</style>