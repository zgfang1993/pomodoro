<template>
  <nav class="title-bar">
    <i class="iconfont" :class="drawerOpened ? 'icon-back' : 'icon-caidan'" @click="toggleDrawer"></i>    
    <h1>番茄钟</h1>
    <div class="action">
      <i class="iconfont icon-close" @click="closeWin"></i>
    </div>
  </nav>
</template>
<script>
import { ipcRenderer } from 'electron';

export default {
  computed: {
    drawerOpened() {
      return this.$store.getters.drawerOpened;
    },
  },
  methods: {
    toggleDrawer() {
      this.$store.dispatch('toggleDrawer');
    },
    closeWin() {
      ipcRenderer.send('close-window');
    }
  },
};
</script>
<style lang="scss">
.title-bar {
  text-align: center;
  padding: 16px 0;
  -webkit-app-region: drag;
  > i {
    font-size: 20px;
    position: absolute;
    top: 15px;
    left: 13px;
    color: $colorPrimary;
    cursor: pointer;
  }
  h1 {
    font-size: 16px;
    color: $colorPrimary;
    cursor: default;
    user-select: none;
    margin: 0;
  }
  .action {
    position: absolute;
    right: 13px;
    top: 16px;
    i {
      font-size: 20px;
      color: $colorPrimary;
      cursor: pointer;
    }
  }
}
</style>