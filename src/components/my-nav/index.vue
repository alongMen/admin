<template>
  <div class="my-nav">
    <section
      class="menu-item"
      v-for="(item, index) in data"
      :key="index"
      @click="selectMenu(item)"
      :class="{ 'menu-item-active': item.path === active }"
    >
      <i :class="item.icon"></i>
      <span>{{ item.name }}</span>
    </section>
  </div>
</template>

<script>
// import menuData from '@/config/menu-data';
export default {
  data() {
    return {
      // data: menuData,

      active: '',
    };
  },
  computed: {
    data() {
      return this.$store.state.permission.tree_list;
    },
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.matched.length < 2) {
          return;
        }
        this.active = to.matched[1].name;
        let subMenu = [];
        for (let i = 0; i < this.data.length; i++) {
          const rowData = this.data[i];
          if (this.active === rowData.path) {
            subMenu = rowData.children || [];
            this.$store.commit('set_current_sub_menus', subMenu);
            break;
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    selectMenu(item) {
      if (item.children && item.children.length > 0) {
        if (item.children[0].children && item.children[0].children.length > 0) {
          this.$router.push({ name: item.children[0].children[0].path });
        } else {
          this.$router.push({ name: item.children[0].path });
        }
      } else {
        this.$router.push({ name: item.path });
      }
    },
  },
};
</script>

<style lang="less">
.my-nav {
  height: 100%;
  width: 152px;
  background-color: #3b69e2;
  padding-top: 60px;
  .menu-item {
    height: 56px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #98b4ff;
    padding-right: 20px;
    border-left: 3px transparent solid;
    user-select: none;
    cursor: pointer;
    transition: all 0.3s;
    i {
      margin-right: 10px;
      &::before {
        color: #98b4ff;
      }
    }
  }

  .menu-item-active {
    color: #fff;
    border-left: 3px #fff solid;
    background-color: rgba(255, 255, 255, 0.24);
    i {
      margin-right: 10px;
      &::before {
        color: #fff;
      }
    }
  }
}
</style>
