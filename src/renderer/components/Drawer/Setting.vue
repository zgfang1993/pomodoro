<template>
  <div class="setting">
    <div class="setting-item">
      <h5>专注</h5>
      <span>{{lworkTime}}:00</span>
      <a-slider :min="1" :max="maxTime" v-model="lworkTime" @change="(val)=>{saveTimerSetting(val, 'workTime', 'work')}"/>
    </div>
    <div class="setting-item">
      <h5>休息</h5>
      <span>{{lshortBreakTime}}:00</span>
      <a-slider :min="1" :max="maxTime" v-model="lshortBreakTime" @change="(val)=>{saveTimerSetting(val, 'shortBreakTime', 'short-break')}"/>
    </div>
    <div class="setting-item">
      <h5>长休息</h5>
      <span>{{llongBreakTime}}:00</span>
      <a-slider :min="1" :max="maxTime" v-model="llongBreakTime" @change="(val)=>{saveTimerSetting(val, 'longBreakTime', 'long-break')}"/>
    </div>
    <div class="setting-item">
      <h5>循环</h5>
      <span>{{lrounds}}</span>
      <a-slider :min="1" :max="maxTime" v-model="lrounds" @change="(val)=>{saveTimerSetting(val, 'rounds')}"/>
    </div>
    <div class="setting-switch-item">
      <span>自动开始</span>
      <a-switch defaultChecked @change="(val)=>{saveSetting(val, 'autoStart')}" size="small" :checked="autoStart" />
    </div>
    <div class="setting-switch-item">
      <span>桌面提示</span>
      <a-switch defaultChecked @change="(val)=>{saveSetting(val, 'notifications')}" size="small" :checked="notifications" />
    </div>
    <div class="setting-switch-item">
      <span>换肤</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link" href="#">
          {{theme}} <a-icon type="down" />
        </a>
        <a-menu slot="overlay" @click="({key})=>{saveSetting(key, 'theme')}">
          <a-menu-item key="light">light</a-menu-item>
          <a-menu-item key="dark">dark</a-menu-item>
        </a-menu>
      </a-dropdown>  
    </div>
    <div class="setting-switch-item">
      <a href="javascript:;" @click="resetDefaults">重置</a>
    </div>
  </div>
</template>
<script>
import EVENT from '@/utils/event';

export default {
  data() {
    return {
      maxTime: 60,
      maxRounds: 12,
      lworkTime: 0,
      lshortBreakTime: 0,
      llongBreakTime: 0,
      lrounds: 0,
    };
  },
  computed: {
    rounds() {
      return this.$store.getters.rounds;
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
    currentRound() {
      return this.$store.getters.currentRound;
    },
    autoStart() {
      return this.$store.getters.autoStart;
    },
    notifications() {
      return this.$store.getters.notifications;
    },
    theme() {
      return this.$store.getters.theme;
    },
  },
  methods: {
    initData() {
      this.lrounds = this.rounds;
      this.lworkTime = this.workTime;
      this.lshortBreakTime = this.shortBreakTime;
      this.llongBreakTime = this.longBreakTime;
    },
    calcWidth(val, max) {
      return `${val / max * 100}%`;
    },
    saveTimerSetting(val, key, setting) {
      const payload = {
        key,
        val,
      };
      this.$store.dispatch('setTimerState', payload);
      // 重置当前 专注/休息/长休息
      if (setting && this.currentRound === setting) {
        EVENT.$emit('time-init', {
          auto: false,
        });
      }
    },
    saveSetting(val, key) {
      const payload = {
        key,
        val,
      };
      this.$store.dispatch('setSettingState', payload);
    },
    resetDefaults() {
      this.$store.dispatch('resetDefaults');
      this.initData();
      EVENT.$emit('time-init', {
        auto: false,
      });
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style lang="scss">
.setting {
  height: calc(100% - 100px);
  padding: 12px 30px 0 30px;
}
.setting-item {
  margin: 0 0 10px;
  text-align: center;
  > h5 {
    font-weight: 400;
    margin-bottom: 5px;
  }
  > span {
    font-size: 10px;
    display: inline-block;
    width: 39px;
    background: #e3e3e3;
    border-radius: 3px;
    padding: 1px 6px;
  }
  .ant-slider {
    margin: 10px 0 10px 7px;
    -webkit-app-region: no-drag;
    .ant-slider-track {
      background-color: $colorPrimary;
    }
    .ant-slider-handle {
      border: solid 2px $colorPrimary;
    }
    &:hover .ant-slider-handle:not(.ant-tooltip-open) {
      border-color: $colorPrimary;
    }
  }
}
.setting-switch-item {
  margin: 10px 0;
  .ant-switch {
    float: right;
    &.ant-switch-checked {
      background-color: $colorPrimary;
    }
  }
  .ant-dropdown-link {
    float: right;
    color: inherit;
  }
}
</style>

