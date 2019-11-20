<template functional>
  <div class="dgl-spinner">
    <div class="dgl-bounce1"></div>
    <div class="dgl-bounce2"></div>
    <div class="dgl-bounce3"></div>
  </div>
</template>

<script>
export default {
  name: 'DglLoader'
};
</script>

<style scoped lang="sass">
.dgl-spinner
  margin: 100px auto 0;
  width: 70px;
  text-align: center;

  & > div
    width: 12px;
    height: 12px;
    background-color: $primary;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: dgl-bouncedelay 1.4s infinite ease-in-out both;
    animation: dgl-bouncedelay 1.4s infinite ease-in-out both;

  & .dgl-bounce1
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;

  & .dgl-bounce2
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;

@keyframes dgl-bouncedelay
  0%,
  80%,
  100%
    -webkit-transform: scale(0);
    transform: scale(0);

  40%
    -webkit-transform: scale(1);
    transform: scale(1);
</style>
