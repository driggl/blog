<template>
  <div class="container">
    <div>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <logo />
          </a>

          <a
            role="button"
            class="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarTop"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarTop" class="navbar-menu">
          <div class="navbar-start"></div>

          <div class="navbar-end">
            <a class="navbar-item">
              Courses
            </a>

            <a
              href="https://patreon.com/driggl"
              class="navbar-item"
              target="_bank"
            >
              Support
            </a>
          </div>
        </div>
      </nav>
      <section>
        <h2 class="title is-3">
          Recently on Driggl
        </h2>
      </section>
    </div>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  }
};
</script>
