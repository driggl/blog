<template>
  <nav class="container navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <navbar-item :url="'/'">
        <logo />
      </navbar-item>

      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': expanded }"
        aria-label="menu"
        :aria-expanded="expanded"
        data-target="navbarTop"
        @click="expanded = !expanded"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarTop" class="navbar-menu" :class="{ 'is-active': expanded }">
      <div class="navbar-start"></div>

      <div class="navbar-end">
        <navbar-item :url="{ name: 'blog' }">
          Blog
        </navbar-item>

        <navbar-item :url="'/#courses'">
          Courses
        </navbar-item>

        <navbar-item :url="'https://patreon.com/driggl'" :external="true">
          Support
        </navbar-item>
      </div>
    </div>
  </nav>
</template>

<script>
import Logo from "~/components/Logo.vue";
import NavbarItem from "~/components/atoms/NavbarItem";

export default {
  components: {
    Logo,
    NavbarItem
  },
  data() {
    return {
      expanded: false
    };
  }
};
</script>

<style scoped lang="sass">

</style>
