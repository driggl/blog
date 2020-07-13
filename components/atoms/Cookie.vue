<template>
  <div class="notification is-warning is-light cookie" v-if="isOpen">
    We use cookies to provide our services and for analytics and marketing. By continuing using this site you agree on our cookies policy
    <nuxt-link class="cookie__link" to="/privacy-policy">Privacy Policy</nuxt-link>.
    <button class="button is-primary is-small is-pulled-right" @click="accept">I understand</button>
  </div>
</template>

<script>
export default {
  name: "CookieMessage",
  props: {
    buttonTextAccept: {
      type: String,
      default: "Ok"
    },
    position: {
      type: String,
      default: "top"
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    containerPosition() {
      return `cookie--${this.position}`;
    }
  },
  created() {
    if (this.getGDPR() != "accepted") {
      this.isOpen = true;
    }
  },
  methods: {
    getGDPR() {
      if (process.browser) {
        return localStorage.getItem("GDPR");
      }
    },
    accept() {
      if (process.browser) {
        this.isOpen = false;
        localStorage.setItem("GDPR", "accepted");
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.cookie
  z-index: 1
  position: fixed
  bottom: 0
  width: 100%
  &__link
    text-decoration: underline
    &:hover
      text-decoration: none !important
</style>