<template>
  <nav class="title-bar">
    <i class="iconfont" :class="[drawerOpened ? 'icon-back' : 'icon-caidan']" @click="toggleDrawer"></i>
    <h1>小番茄计时</h1>
    <div class="action">
      <i class="iconfont icon-zuixiaohua" @click="minWin"></i>
      <i class="iconfont icon-close" @click="closeWin"></i>
    </div>
  </nav>
</template>
<script>
import { ipcRenderer } from 'electron'

export default {
  computed: {
    drawerOpened() {
      return this.$store.getters.drawerOpened;
    }
  },
  methods: {
    toggleDrawer() {
      this.$store.dispatch('toggleDrawer');
    },
    closeWin() {
      ipcRenderer.send('pomodoro:close-window');
    },
    minWin() {
      ipcRenderer.send('pomodoro:min-window');
    }
  },
};
</script>
<style lang="scss">
.title-bar {
  text-align: center;
  padding: 18px 0 0 0;
  > i {
    font-size: 20px;
    position: absolute;
    top: 16px;
    left: 13px;
    color: $colorPrimary;
  }
  h1 {
    font-size: 16px;
    color: $colorPrimary;
  }
  .action {
    position: absolute;
    right: 13px;
    top: 16px;
    i {
      font-size: 20px;
      color: $colorPrimary;
    }
  }
}
</style>