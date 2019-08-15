<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { set_favicon } from '@/utils/base';
export default {
  computed: {
    siteInfo() {
      return this.$store.state.base.site_info;
    },
  },
  async mounted() {
    await this.$store.dispatch('get_site_info');
    set_favicon(this.siteInfo.otherLogo);
  },
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
