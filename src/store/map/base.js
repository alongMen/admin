import {
  get_banks,
  get_geme_type,
  get_game_platform,
  get_qrcodes,
  get_all_provider_name,
  get_site_info,
} from '@/service/index';

const state = {
  bank_list: [],
  qrcode_list: [],
  game_type_list: [],
  game_platform_list: [],
  provider_names: [],
  site_info: {},
};

const mutations = {
  set_provider_names(state, data) {
    state.provider_names = data;
  },
  set_bank_list(state, data) {
    state.bank_list = data;
  },
  set_game_type_list(state, data) {
    state.game_type_list = data;
  },
  set_game_platform_list(state, data) {
    state.game_platform_list = data;
  },
  set_qrcode_list(state, data) {
    state.qrcode_list = data;
  },
  set_site_info(state, data) {
    state.site_info = data;
  },
};

const actions = {
  async get_provider_names({ commit }) {
    const res = await get_all_provider_name();
    if (res.status < 400) {
      const data = []
      res.data.forEach(v=>{
        data.push({
          label:v.name,
          value:v.id
        })
      })
      commit('set_provider_names', data);
    }
  },
  async get_bank_list({ commit }) {
    const res = await get_banks();
    if (res.status < 400) {
      commit('set_bank_list', res.data);
    }
  },
  async get_game_type_list({ commit }) {
    const res = await get_geme_type();
    if (res.status < 400) {
      commit('set_game_type_list', res.data);
    }
  },
  async get_game_platform_list({ commit }) {
    const res = await get_game_platform();
    if (res.status < 400) {
      commit('set_game_platform_list', res.data);
    }
  },
  async get_qrcode_list({ commit }) {
    const res = await get_qrcodes();
    if (res.status < 400) {
      commit('set_qrcode_list', res.data);
    }
  },

  async get_site_info({ commit }) {
    const res = await get_site_info();
    if (res.status < 400) {
      commit('set_site_info', res.data);
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
