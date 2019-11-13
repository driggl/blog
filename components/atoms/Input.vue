<template>
  <div class="control has-icons-left has-icons-right">
    <input
      class="input"
      :class="{ 'is-success': success, 'is-danger': error }"
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <span class="icon is-small is-left">
      <i :class="'fa fa-' + leftIcon"></i>
    </span>
    <span v-if="hasRightIcon" class="icon is-small is-right">
      <i :class="'fa fa-' + rightIcon"></i>
    </span>
  </div>
</template>

<script>
// Usage: <Input :class='"is-success"' :placeholder="'Foo'" :value="'Bar'" @input="bar.foo = $event"/>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    leftIcon: {
      type: String,
      default: "user"
    },
    errorMsg: {
      type: String,
      default: ""
    }
  },
  computed: {
    hasRightIcon() {
      return this.success || this.error;
    },
    rightIcon() {
      if (this.success) {
        return "check";
      } else {
        return "exclamation-triangle";
      }
    },
    success() {
      return !!this.value && !this.errorMsg;
    },
    error() {
      return !!this.errorMsg;
    }
  }
};
</script>
