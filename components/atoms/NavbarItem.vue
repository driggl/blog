<template>
  <a :href="url" class="navbar-item" v-if="external">
    <slot></slot>
  </a>
  <nuxt-link :to="url" class="navbar-item" v-else>
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