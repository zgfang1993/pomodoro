<template>
  <div class="time-dial">
    <slot></slot>
    <svg 
      version="1.2" 
      baseProfile="tiny" 
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" 
      viewBox="0 0 230 230" 
      xml:space="preserve"
      width="220"
      height="220"
      class="dial-fill"
      :class="dialClass"
    >
      <path 
        fill="none"
        stroke-width="10" 
        stroke-linecap="round" 
        stroke-miterlimit="10"
        d="M115,5c60.8,0,110,49.2,110,110s-49.2,110-110,110S5,175.8,5,115S54.2,5,115,5"
      />
    </svg>
    <svg 
      version="1.2" 
      baseProfile="tiny" 
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px" y="0px" 
      viewBox="0 0 230 230" 
      xml:space="preserve"
      width="220"
      height="220"
      class="dial-bg"
    >
      <path 
        fill="none" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-miterlimit="10" 
        d="M115,5c60.8,0,110,49.2,110,110s-49.2,110-110,110S5,175.8,5,115S54.2,5,115,5"
      />
    </svg>
  </div>
</template>
<script>
import anime from 'animejs';
import EVENT from '@/utils/event';
import config from '@/config/index';
import { querySetting } from '../../db.js';

const { TIME_ROUND } = config;

export default {
  data: () => ({
    dial: null,
  }),
  computed: {
    dialClass() {
      const { currentRound } = this;
      switch (currentRound) {
        case TIME_ROUND.WORK:
          return 'dial-fill-work';
          break;
        case TIME_ROUND.SHORT_BREAK:
          return 'dial-fill-short';
          break;
        case TIME_ROUND.LONG_BREAK:
          return 'dial-fill-long';
          break;
      }
    },
    currentRound() {
      return this.$store.getters.currentRound;
    },
    workTime() {
      return this.$store.getters.workTime * 60 * 1000;
    },
    shortBreakTime() {
      return this.$store.getters.shortBreakTime * 60 * 1000;
    },
    longBreakTime() {
      return this.$store.getters.longBreakTime * 60 * 1000;
    },
  },
  methods: {
    dialAnime(duration) {
      this.dial = anime({
        targets: '.dial-fill path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        duration,
        direction: 'reverse',
        autoplay: false,
      });
      this.dial.seek(this.dial.duration);
    },
    dialEvent() {
      EVENT.$on('time-start', () => {
        this.dial.play();
      });
      EVENT.$on('time-pause', () => {
        this.dial.pause();
      });
      // 重置
      EVENT.$on('time-reset', () => {
        this.dial.pause();
        this.dial.seek(this.dial.duration);
      });
      EVENT.$on('time-init', (option) => {
        const { currentRound } = this;
        this.dial.pause();
        switch (currentRound) {
          case TIME_ROUND.WORK:
            this.dialAnime(this.workTime);
            break;
          case TIME_ROUND.SHORT_BREAK:
            this.dialAnime(this.shortBreakTime);
            break;
          case TIME_ROUND.LONG_BREAK:
            this.dialAnime(this.longBreakTime);
            break;
        }
      });
    },
  },
  mounted() {
    querySetting((res) => {
      console.log('querySetting', res);
      const time = res ? res.workTime * 60 * 1000 : this.workTime;
      this.dialAnime(time);
    });
    this.dialEvent();
  },
};
</script>
<style lang="scss">
  .time-dial {
    display: flex;
    justify-content: center;
    margin-top: 70px;
    position: relative;
  }
  .dial-fill {
    position: absolute;
  }
  .dial-fill-work {
    stroke: $colorPrimary;
  }
  .dial-fill-short {
    stroke: $colorGreen;
  }
  .dial-fill-long {
    stroke: $colorDeepGreen;
  }
  .dial-bg {
    stroke: $colorBg;
  }
</style>


