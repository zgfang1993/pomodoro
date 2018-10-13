<template>
  <div class="time-wrap">
    <time-dial>
      <p class="dial-time">{{ timerStarted ? formatTime : `${minutes}:00` }}</p>
      <p class="dial-stage">{{dialStage}}</p>
    </time-dial>

    <div class="time-controller">
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <i class="iconfont icon-stop ant-dropdown-link ant-dropdown-link"></i>
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="0" :disabled="currentRound === TIME_ROUND.WORK ? false : true">放弃关注</a-menu-item>
          <a-menu-item key="2" :disabled="currentRound === TIME_ROUND.WORK ? false : true">提前完成</a-menu-item>
          <a-menu-item key="3">重新开始</a-menu-item>
        </a-menu>
      </a-dropdown>      
      <p class="play-bg" @click="handleTimer">
        <i class="iconfont" :class="[timerStarted && timerRunning? 'icon-pause':'icon-play']"></i>
      </p>
      <i class="iconfont icon-skip_next" @click="skipRound"></i>
    </div>
    <div class="round-info">
      <img :src="tomotoIcon"/>
      <span>{{round}}/{{rounds}}</span>
    </div>
  </div>
</template>
<script>
import timeDial from '@/components/Time/TimeDial';
import config from '@/config/index';
import Timer from '@/utils/timer';
import EVENT from '@/utils/event';
import { initDb, querySetting, saveChartData } from '../../db.js';
import tomotoIcon from '../../../img/tomoto.png';

const { TIME_ROUND } = config;

export default {
  data() {
    return {
      timerRunning: false,
      timerStarted: false,
      timer: null,
      minutes: 1,
      tomotoIcon,
    };
  },
  components: {
    timeDial,
  },
  computed: {
    round() {
      return this.$store.getters.round;
    },
    rounds() {
      return this.$store.getters.rounds;
    },
    currentRound() {
      return this.$store.getters.currentRound;
    },
    workTime() {
      return this.$store.getters.workTime;
    },
    shortBreakTime() {
      return this.$store.getters.shortBreakTime;
    },
    longBreakTime() {
      return this.$store.getters.longBreakTime;
    },
    autoStart() {
      return this.$store.getters.autoStart;
    },
    formatTime() {
      const { time } = this.timer;
      const currentTime = this.minutes * 60 - time;
      const currMins = Math.floor(currentTime / 60);
      const currSends = this.formatDouble(currentTime - currMins * 60);

      return `${currMins}:${currSends}`;
    },
    dialStage() {
      switch (this.currentRound) {
        case TIME_ROUND.WORK:
          return '专注';
          break;
        case TIME_ROUND.SHORT_BREAK:
          return '休息';
          break;
        case TIME_ROUND.LONG_BREAK:
          return '长休息';
          break;
      }
    },
    TIME_ROUND() {
      return TIME_ROUND;
    },
  },
  methods: {
    initData() {
      // 初始化数据数据库数据
      initDb();

      // 更新store为数据库数据
      querySetting((res) => {
        if (res) {
          Object.keys(res).forEach((key) => {
            if (key !== '_id') {
              const payload = {
                key,
                val: res[key],
                init: true,
              };
              this.$store.dispatch('setTimerState', payload);
              this.$store.dispatch('setSettingState', payload);
            }
          });
          console.log('dispatch 初始化', this.$store.getters);
        }
        this.initTimer();
      });
    },
    initTimer() {
      const createTimer = (time) => {
        this.timer = new Timer(time);
        this.minutes = time;
      };
      switch (this.currentRound) {
        case TIME_ROUND.WORK:
          createTimer(this.workTime);
          break;
        case TIME_ROUND.SHORT_BREAK:
          createTimer(this.shortBreakTime);
          break;
        case TIME_ROUND.LONG_BREAK:
          createTimer(this.longBreakTime);
          break;
      }
    },
    handleTimer() {
      if (!this.timerStarted) { // 开始
        this.timer.start();
        this.timerStarted = true;
        this.timerRunning = true;
      } else if (this.timerStarted && this.timerRunning) { // 暂停
        this.timer.pause();
        this.timerRunning = false;
      } else if (this.timerStarted && !this.timerRunning) { // 恢复
        this.timer.start();
        this.timerRunning = true;
      }
    },
    resetTimer() {
      this.timer.reset();
      this.timerRunning = !this.timerRunning;
      this.timerStarted = false;
    },
    dialEvent() {
      // 一圈倒计时结束
      EVENT.$on('time-end', (option) => {
        this.changeRound(option);
        EVENT.$emit('time-init', {
          auto: this.autoStart,
        });
        console.log('结束了', this.timer.time);
      });

      // 结束/更改设置
      EVENT.$on('time-init', (option) => {
        this.timer.reset();
        this.initTimer();
        if (option.auto) {
          setTimeout(() => {
            this.timerStarted = false;
            this.handleTimer();
          }, 1500);
        } else {
          this.timerRunning = false;
        }
      });
    },
    changeRound(option = {}) {
      const { currentRound, round, rounds } = this;
      console.log('changeRound', currentRound, round, rounds);
      if (currentRound === TIME_ROUND.WORK) { // 专注
        if (round + 1 > rounds) {
          this.$store.dispatch('updateCurrentRound', TIME_ROUND.LONG_BREAK);
          EVENT.$emit('start-long-break');
          return;
        }
        this.$store.dispatch('updateCurrentRound', TIME_ROUND.SHORT_BREAK);
        EVENT.$emit('start-short-break');
        // 保存数据
        saveChartData({
          type: option.skip ? 2 : 1, // type: 0放弃 1完成 2提前完成
        });
      } else if (currentRound === TIME_ROUND.SHORT_BREAK) { // 休息
        // add round
        this.$store.dispatch('AddRound');
        this.$store.dispatch('updateCurrentRound', TIME_ROUND.WORK);
        EVENT.$emit('start-work');
      } else if (currentRound === TIME_ROUND.LONG_BREAK) { // 长休息
        this.$store.dispatch('updateCurrentRound', TIME_ROUND.WORK);
        this.$store.dispatch('resetRound');
        EVENT.$emit('start-work');
      }
    },
    skipRound() {
      EVENT.$emit('time-end', { skip: true });
    },
    formatDouble(val) {
      if (val < 10) {
        return `0${val}`;
      }
      return val;
    },
    handleMenuClick({ key }) {
      console.log(`Click on item ${key}`);
      // 重新开始
      if (+key === 3) {
        EVENT.$emit('time-init', {
          auto: false,
        });
      } else {
        this.skipRound();
        // 保存数据
        saveChartData({
          type: +key, // type: 0放弃 2提前完成
        });
      }
    },
  },
  mounted() {
    this.initData();
    this.dialEvent();
  },
};
</script>
<style lang="scss">
.time-controller {
  margin: 40px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  i {
    font-size: 20px;
    color: $colorPrimary;
  }
  .play-bg {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(230, 230, 230, 0.31);
    text-align: center;
    line-height: 48px;
    border: 1px solid rgba(255, 255, 255, 0);
    margin: 0 20px;
  }
}
.dial-time {
  position: absolute;
  font-size: 46px;
  color: $colorPrimary;
  top: 73px;
}
.dial-stage {
  position: absolute;
  top: 150px;
}
.round-info {
  padding: 20px 13px;
  img {
    width: 18px;
    position: relative;
    top: -2px;
  }
}
</style>

