<template>
  <nuxt-link :to="url" class="navbar-item" :target="target">
    <slot></slot>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    url: { required: "true" },
    external: { type: Boolean, default: false }
  },
  computed: {
    target() {
      return this.external ? "_bank" : "none";
    }
  }
};
</script>