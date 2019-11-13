<template>
  <div class="card">
    <div class="columns">
      <div class="column is-half">
        <figure class="image">
          <img :src="imageUrl" alt="Placeholder image" />
        </figure>
      </div>
      <div class="card-content">
        <h3 class="title is-5">{{ title }}</h3>
        <div class="article-meta">
          <span>Category: </span><strong>{{ category }}</strong>
          <span>Author: </span><strong>{{ author }}</strong>
        </div>
        <div class="content">
          <p>{{ content }}</p>
        </div>
        <div class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <a href="/">
                read more...
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    authorId: {
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
  computed: {
    author() {
      return "Sebastian Wilgosz";
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
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
  margin-bottom: 20px;
}
.card-image {
  max-width: 50%;
}
</style>