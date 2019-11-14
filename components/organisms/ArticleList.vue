<template>
  <div class="articles">
    <article-list-item
      :key="id"
      :title="attributes.title"
      :content="attributes.excerpt"
      :slug="attributes.slug"
      :category="'Web development'"
      :imageUrl="attributes.thumbnail.small"
      :authorId="relationships.author.data.id"
      v-for="[id, { attributes, relationships }] in articles"
    />
  </div>
</template>

<script>
import ArticleListItem from "~/components/molecules/ArticleListItem";

export default {
  components: {
    ArticleListItem
  },
  props: {
    articles: {
      type: Map,
      required: true
    }
  }
};
</script>