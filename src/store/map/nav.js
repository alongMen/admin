const state = {
  current_sub_menus: [], //当前二级菜单列表
  current_third_menus: [], //当前三级菜单,
};

const mutations = {
  set_current_sub_menus(state, data) {
    state.current_sub_menus = data;
  },
  set_current_third_menus(state, data) {
    state.current_third_menus = data;
  },
};

export default {
  state,
  mutations,
};
