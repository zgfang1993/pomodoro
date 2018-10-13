import { updateSetting } from '../../db';
import config from '../../config/index';
const { defaultSetting } = config;

export default {
  state: {
    autoStart: defaultSetting.autoStart,
    notifications: defaultSetting.notifications,
    drawerOpened: false,
    currentDrawer: 'Setting',
    theme: defaultSetting.theme,
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
    theme(state) {
      return state.theme;
    }
  },
  mutations: {
    TOGGLE_DRAWER(state) {
      state.drawerOpened = !state.drawerOpened;
    },
    SET_STATE(state, payload) {
      state[payload.key] = payload.val;
    },
    RESET_DEFAULTS(state) {
      state.autoStart = defaultSetting.autoStart;
      state.notifications = defaultSetting.notifications;
      state.theme = defaultSetting.theme;
    },
  },
  actions: {
    toggleDrawer({ commit }) {
      commit('TOGGLE_DRAWER');
    },
    setSettingState({ commit }, payload) {
      commit('SET_STATE', payload);
      // 保存数据库
      if (payload.key === 'autoStart' || payload.key === 'notifications' || payload.key === 'theme') {
        updateSetting(payload.key, payload.val);
      }
    },
    resetDefaults({ commit }) {
      commit('RESET_DEFAULTS');
      // 保存数据库
      updateSetting('autoStart', defaultSetting.autoStart);
      updateSetting('notifications', defaultSetting.notifications);
      updateSetting('theme', defaultSetting.theme);
    },
  },
};
