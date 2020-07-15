<template>
  <div class="article-meta">
    <span>Category: </span><strong>Web development</strong>
    <span>Author: </span>
    <strong v-if="links"><a :href="author.url" target="_blank">{{ author.name }}</a></strong>
    <strong v-else>{{ author.name }}</strong>
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
  }
}
</script>
