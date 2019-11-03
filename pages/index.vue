<template>
  <div class="container">
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
    <div class="container main">
      <div class="columns">
        <div class="column is-two-third-tablet">
          <section class="header">
            <h2 class="title is-4">
              Recently on Driggl
            </h2>
          </section>

          <div class="card">
            <div class="card-image">
              <figure class="image">
                <img
                  src="https://bulma.io/images/placeholders/1280x960.png"
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="card-content">
              <h3 class="title is-5">
                Handling Errors in Ruby on Rails Applications
              </h3>
              <div class="article-meta">
                <span>Category: </span><strong>Web development</strong>
                <span>Author: </span><strong>Seabastian Wilgosz</strong>
              </div>
              <div class="content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus nec iaculis mauris.
                </p>
              </div>
              <div class="level">
                <div class="level-left"></div>
                <div class="level-right">
                  <div class="level-item">
                    read more...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside class="column is-one-third-tablet">
          <section class="header">
            <h2 class="title is-4">
              Do you like this content?
            </h2>
          </section>
        </aside>
      </div>
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

<style>
.header {
  padding: 40px 0;
}
.card {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.is-circle {
  border-radius: 50%;
}

.article-meta {
  font-size: 0.8rem;
  margin-top: -10px;
  margin-bottom: 20px;
}

.card-image {
  max-width: 50%;
}
</style>