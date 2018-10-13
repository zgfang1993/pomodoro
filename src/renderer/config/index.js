const TIME_ROUND = {
  WORK: 'work',
  SHORT_BREAK: 'short-break',
  LONG_BREAK: 'long-break',
};

const defaultSetting = {
  autoStart: false,
  notifications: true,
  theme: 'light',
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  round: 1,
  rounds: 4,
};

export default {
  TIME_ROUND,
  defaultSetting,
};
