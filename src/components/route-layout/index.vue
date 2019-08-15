<template>
  <div class="route-layout">
    <sub-menu />
    <div class="sub-router">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SubMenu from '@/components/sub-menu/index';
export default {
  components: {
    SubMenu,
  },
};
</script>

<style lang="less">
.route-layout {
  width: 100%;
  height: 100%;
  display: flex;

  .sub-router {
    height: 100%;
    width: calc(100% - 104px);
    overflow: auto;
  }
}
</style>
