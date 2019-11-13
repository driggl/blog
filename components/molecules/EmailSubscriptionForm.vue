<template>
  <mailchimp-subscribe
    url="https://driggl.us9.list-manage.com/subscribe/post-json"
    user-id="0cbf9512faab835f9be304437"
    list-id="4c303aa769"
    @error="onError"
    @success="onSuccess"
  >
    <template v-slot="{ subscribe, setEmail, error, success, loading }">
      <form @submit.prevent="subscribe">
        <div class="field">
          <label class="label">Email</label>
          <Input
            v-model="email"
            :left-icon="'envelope'"
            :error-msg="error"
            @input="setEmail($event)"
          />
          <p v-html="error" v-if="error" class="help is-danger"></p>
        </div>

        <button class="button is-primary is-fullwidth" type="submit">
          Submit
        </button>
      </form>
    </template>
  </mailchimp-subscribe>
</template>

<script>
import Input from "@/components/atoms/Input";
import MailchimpSubscribe from "vue-mailchimp-subscribe";

export default {
  components: {
    Input,
    MailchimpSubscribe
  },
  data() {
    return {
      email: "",
      error: ""
    };
  },
  methods: {
    onError(error) {
      this.error = error;
    },
    onSuccess() {}
  }
};
</script>

<style scoped lang='sass'>
.field
  margin-top: 20px
</style>
