<template>
  <!-- <div>HELLO</div> -->
  <mailchimp-subscribe
    url="https://driggl.us9.list-manage.com/subscribe/post-json"
    user-id="0cbf9512faab835f9be304437"
    list-id="4c303aa769"
    @error="onError"
    @success="onSuccess"
  >
    <template v-slot="{ subscribe, setEmail, error, success, loading }">
      <div>
        <h2 class="title is-4">
          Do you like this content?
        </h2>
        <p>
          <i
            >Join to our Newsletter for weekly updates about new articles and
            <strong>free programming tips!</strong></i
          >
        </p>
        <form @submit.prevent="subscribe">
          <div class="field">
            <label v-if="showLabel" class="label">Email</label>
            <Input
              v-model="email"
              :left-icon="'envelope'"
              :error-msg="error"
              :placeholder="placeholder"
              @input="setEmail($event)"
            />
            <p v-html="error" v-if="error" class="help is-danger"></p>
            <p
              v-html="successMessage"
              v-if="success"
              class="help is-success"
            ></p>
          </div>

          <button class="button is-primary is-fullwidth" type="submit">
            Submit
          </button>
        </form>
      </div>
    </template>
  </mailchimp-subscribe>
</template>

<script>
import Input from "@/components/atoms/Input";
import MailchimpSubscribe from "vue-mailchimp-subscribe";

export default {
  props: {
    showLabel: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  components: {
    Input,
    MailchimpSubscribe
  },
  data() {
    return {
      email: "",
      error: "",
      successMessage: ""
    };
  },
  methods: {
    onError(error) {
      this.error = error;
    },
    onSuccess() {
      this.successMessage =
        "Thank you! Check out your mailbox to confirm subscription!";
    }
  }
};
</script>

<style scoped lang='sass'>
.field
  margin-top: 20px
.label
  text-align: left
</style>
