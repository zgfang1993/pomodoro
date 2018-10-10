import { updateSetting } from '../../db';
import config from '../../config/index';
const { defaultSetting } = config;

export default {
  state: {
    autoStart: defaultSetting.autoStart,
    notifications: defaultSetting.notifications,
    drawerOpened: false,
    currentDrawer: 'Setting',
  },
  getters: {
    autoStart(state) {
      return state.autoStart;
    },
    currentDrawer(state) {
      return state.currentDrawer;
    },
    drawerOpened(state) {
      return state.drawerOpened;
    },
    notifications(state) {
      return state.notifications;
    },
  },
  mutations: {
    TOGGLE_DRAWER(state) {
      state.drawerOpened = !state.drawerOpened;
    },
    SET_STATE(state, payload) {
      state[payload.key] = payload.val;
    },
    RESET_DEFAULTS(state) {
      state.autoStart = false;
      state.notifications = true;
    },
  },
  actions: {
    toggleDrawer({ commit }) {
      commit('TOGGLE_DRAWER');
    },
    setSettingState({ commit }, payload) {
      commit('SET_STATE', payload);
      // 保存数据库
      if (payload.key === 'autoStart' || payload.key === 'notifications') {
        updateSetting(payload.key, payload.val);
      }
    },
    resetDefaults({ commit }) {
      commit('RESET_DEFAULTS');
      // 保存数据库
      updateSetting('autoStart', false);
      updateSetting('notifications', true);
    },
  },
};
