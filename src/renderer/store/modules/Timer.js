import { updateSetting } from '../../db';
import config from '../../config/index';
const { defaultSetting } = config;

export default {
  state: {
    workTime: defaultSetting.workTime,
    shortBreakTime: defaultSetting.shortBreakTime,
    longBreakTime: defaultSetting.longBreakTime,
    round: defaultSetting.round,
    rounds: defaultSetting.rounds,
    currentRound: 'work',
  },
  getters: {
    round(state) {
      return state.round;
    },
    rounds(state) {
      return state.rounds;
    },
    shortBreakTime(state) {
      return state.shortBreakTime;
    },
    longBreakTime(state) {
      return state.longBreakTime;
    },
    workTime(state) {
      return state.workTime;
    },
    currentRound(state) {
      return state.currentRound;
    },
  },
  mutations: {
    UPDATE_CURRENT_ROUND(state, payload) {
      state.currentRound = payload;
    },
    ADD_ROUND(state) {
      state.round += 1;
    },
    RESET_ROUND(state) {
      state.round = 1;
    },
    SET_TIMER_STATE(state, payload) {
      state[payload.key] = payload.val;
    },
    RESET_DEFAULTS(state) {
      state.rounds = 4;
      state.workTime = 25;
      state.shortBreakTime = 5;
      state.longBreakTime = 15;
    },
  },
  actions: {
    updateCurrentRound({ commit }, payload) {
      commit('UPDATE_CURRENT_ROUND', payload);
    },
    AddRound({ commit }, payload) {
      commit('ADD_ROUND', payload);
    },
    resetRound({ commit }) {
      commit('RESET_ROUND');
    },
    setTimerState({ commit }, payload) {
      commit('SET_TIMER_STATE', payload);
      // 保存数据库
      if (!payload.init) {
        updateSetting(payload.key, payload.val);
      }
    },
    resetDefaults({ commit }) {
      commit('RESET_DEFAULTS');
      // 保存数据库
      updateSetting('rounds', 4);
      updateSetting('workTime', 25);
      updateSetting('shortBreakTime', 5);
      updateSetting('longBreakTime', 15);
    },
  },
};
