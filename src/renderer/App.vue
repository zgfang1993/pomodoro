<template>
  <div id="app" :class="theme">
    <titlebar></titlebar>
    <transition name="slide-left" mode="out-in">
      <drawer v-if="drawerOpened"/>
    </transition>
    <timer></timer>
    <notification v-if="notifications"></notification>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import titlebar from '@/components/Titlebar';
import drawer from '@/components/Drawer/Drawer';
import timer from '@/components/Time/Time';
import notification from '@/components/Notification/Notification';
import '@/styles/iconfont.css';
import '@/styles/theme-dark.scss';

export default {
  name: 'pomodoro',
  components: {
    titlebar,
    timer,
    notification,
    drawer,
  },
  computed: {
    drawerOpened() {
      return this.$store.getters.drawerOpened;
    },
    notifications() {
      return this.$store.getters.notifications;
    },
    theme() {
      return `theme-${this.$store.getters.theme}`;
    },
  },
  methods: {
  },
  mounted() {
  },
};
</script>

<style lang="scss">
  // #app {
  //   -webkit-app-region: drag;
  // }
</style>
