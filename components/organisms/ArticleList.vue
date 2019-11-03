<template>
  <div class="articles">
    <article-list-item
      :key="id"
      :title="attributes.title"
      :content="attributes.excerpt"
      :category="attributes.category"
      :authorId="relationships.author.data.id"
      v-for="{ id, attributes, relationships } in articles"
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
      type: Array,
      default: []
    }
  }
};
</script>