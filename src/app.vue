<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {}
    }
  }
</script>
<style lang="less">
  @import "base/reset.css";

  html, body, #app {
    overflow-x: hidden;
    width: 100%;
    height: 13.3125rem;
    min-height: 100%;
  }
</style>

