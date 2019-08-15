<template>
  <div class="sub-menu">
    <section
      @click="selectMenu(item)"
      v-for="(item, index) in current_sub_menus"
      :key="index"
      class="sub-menu-item"
      :class="{ 'sub-menu-item-active': item.path === active }"
    >
      {{ item.name }}
    </section>
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
    current_sub_menus() {
      return this.$store.state.nav.current_sub_menus;
    },
  },
  watch: {
    $route: {
      handler: function(to) {
        setTimeout(() => {
          if(to.matched.length >=3){
              this.active = to.matched[2].name;
          }
          let thirdMenu = [];

          for (let i = 0; i < this.current_sub_menus.length; i++) {
            const rowData = this.current_sub_menus[i];
            if (this.active === rowData.path) {
              thirdMenu = rowData.children || [];
              this.$store.commit('set_current_third_menus', thirdMenu);
              break;
            }
          }          
        }, 0);

      },
      immediate: true,
    },
  },
  methods: {
    selectMenu(item) {
      if (item.children && item.children.length > 0) {
        this.$router.push({ name: item.children[0].path });
      } else {
        this.$router.push({ name: item.path });
      }
    },
  },
};
</script>

<style lang="less">
.sub-menu {
  width: 104px;
  height: 100%;
  background-color: #fff;
  .sub-menu-item {
    width: 100%;
    display: flex;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #b6b8c5;
    align-items: center;
    justify-content: center;
    height: 80px;
    user-select: none;
    cursor: pointer;
    transition: all 0.3s;
  }
  .sub-menu-item-active {
    background-color: #f6f7f9;
    color: #323650;
  }
}
</style>
