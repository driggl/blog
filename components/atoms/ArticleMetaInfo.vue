<template>
  <div class="article-meta">
    <span>Category: </span><strong>Web development</strong>
    <span>Author: </span>
    <strong v-if="links"><a :href="author.url" target="_blank">{{ authorName }}</a></strong>
    <strong v-else>{{ authorName }}</strong>
  </div>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true
    },
    links: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    authorName() {
      return this.author.fullName || this.author.username || "Sebastian Wilgosz"
    }
  }
}
</script>
