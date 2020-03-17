<template>
  <pre>{{ html }}</pre>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      html: "INITIAL"
    };
  },
  created() {
    this.html = this.snippets[this.index].inner;
  },
  computed: {
    snippets() {
      let preContents = this.text.match(/<pre[^>]*>.*?<\/pre>/gims);

      let snippetList = preContents.map((preContent, index) => {
        return {
          id: index,
          inner: preContent
            .match(/<pre[^>]*>.*?<\/pre>/gims)[0]
            .replace(/<\/?pre[^>]*>/gims, "")
            .replace(/&lt;/gims, "<")
            .replace(/&gt;/gims, ">")
            .replace(/&nbsp;/gims, " ")
            .replace(/\n$/, ""),
          content: preContent
        };
      });
      return snippetList;
    }
  }
};
</script>
<style scoped lang=sass>
</style>
