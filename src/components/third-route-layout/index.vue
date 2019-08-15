<template>
  <div class="third-route-layout">
    <div class="third-menus">
      <div
        @click="selectMenu(item)"
        class="third-menus-item"
        v-for="(item, index) in current_third_menus"
        :key="index"
        :class="{ 'third-menus-item-active': item.path === active }"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="third-route">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: '',
    };
  },
  computed: {
    current_third_menus() {
      return this.$store.state.nav.current_third_menus;
    },
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.matched.length > 3) {
          this.active = to.matched[3].name;
        }
      },
      immediate: true,
    },
  },
  methods: {
    selectMenu(item) {
      this.$router.push({ name: item.path });
    },
  },
};
</script>

<style lang="less">
.third-route-layout {
  width: 100%;
  height: 100%;
  padding-left: 64px;
  padding-top: 40px;
  .third-menus {
    display: flex;
    .third-menus-item {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #888a9b;
      padding: 8px 20px 8px 20px;
      margin-right: 30px;
      user-select: none;
      cursor: pointer;
      transition: all 0.3s;
    }
    .third-menus-item-active {
      background: #3b69e2;
      border-radius: 100px;
      color: #fff;
    }
  }
}
</style>
