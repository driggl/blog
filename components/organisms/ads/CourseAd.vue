<template>
  <div class="columns" :style="`background-color: ${bg}`">
    <div class="column is-one-half">
      <img src="~assets/rails-rest-api.jpg" />
    </div>
    <div class="column is-one-half">
      <div class="content">
        <h2 class="title">Ruby On Rails REST API</h2>
        <h3 class="subtitle" :class="size === 'small' ? 'is-4' : 'is-5'">
          The complete guide
        </h3>
        <p :class="size === 'small' ? 'is-size-6' : 'is-size-3'">
          Create professional API applications that you can hook anything into!
          Learn how to code like professionals using Test Driven Development!
        </p>
      </div>
      <a
        href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
        target="_blank"
        class="button is-primary has-text-weight-bold"
        :class="size === 'small' ? 'is-medium' : 'is-large'"
      >
        Take this course for 10$ >
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      required: false,
      default: "big"
    },
    bg: {
      type: String,
      required: false,
      default: "#fff"
    }
  }
};
</script>
<style scoped lang=sass>

</style>