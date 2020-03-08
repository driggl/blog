<template>
  <div>
    <top-nav />
    <section
      class="hero has-background-image"
      style="background-image: url('/home-cover.jpg')"
    >
      <div class="cover social" style="display: none">
        <img src="/home-cover.jpg" />
      </div>
      <div class="hero-body has-mask">
        <div class="container has-text-right">
          <h1 class="title">
            Wanna be a developer?
          </h1>
          <a
            href="#courses"
            class="button is-primary has-text-weight-bold is-large"
          >
            Check out our courses!
          </a>
        </div>
      </div>
    </section>
    <section class="section hero">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h2 class="title">
            Experienced & Trusted by
            <strong><span class="has-text-orange">700+</span></strong> People
            worldwide
          </h2>
          <a
            href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
            class="button is-primary has-text-weight-bold is-large"
          >
            Start learning now!
          </a>
        </div>
      </div>
    </section>
    <section id="courses" class="section">
      <CourseAd />
    </section>
    <section class="hero section">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h2 class="title">
            Not sure if it's for you?
          </h2>
          <h3 class="subtitle">
            No worries, we offer
            <strong><span class="has-text-orange">30-day</span></strong>
            money-back!
          </h3>
          <a
            href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
            class="button is-primary has-text-weight-bold is-large"
          >
            Check it out!
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "~/components/Logo.vue";
import TopNav from "~/components/organisms/TopNav";
import CourseAd from "~/components/organisms/ads/CourseAd";

export default {
  name: "Articles",
  head: {
    title: "Driggl - Modern web development",
    titleTemplate: null,
    meta: [
      {
        hid: "description",
        name: "description",
        content:
          "Build modern websites like a professional with Driggl Community!"
      },
      {
        hid: "author",
        name: "author",
        content: "Driggl - https://driggl.com"
      },
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:title",
        content: "Driggl - Modern web development",
        vmid: "og:title"
      },
      {
        property: "og:description",
        content:
          "Build modern websites like a professional with Driggl Community!",
        vmid: "og:description"
      },
      {
        property: "og:image",
        content: "/home-cover.jpg",
        vmid: "og:image"
      }
    ]
  },
  components: {
    CourseAd
    Logo,
    TopNav
  },
  data() {
    return {
      courseUrl:
        "https://www.udemy.com/course/ruby-on-rails-api-the-complete-guide/learn/lecture/13319926?couponCode=DGLWEB#overview"
    };
  }
};
</script>

<style scoped lang='sass'>
.has-background-image
  background-size: cover
  backgorund-position: center

.has-mask
  min-height: 600px
  background-color: rgba(0,0,0,0.65)
  display: flex

  .container
    display: flex
    align-self: center
    align-items: flex-end
    flex-direction: column
    .title
      color: $white
</style>
