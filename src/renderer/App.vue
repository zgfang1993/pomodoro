<template>
  <div id="app">
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

export default {
  name: 'pomodoro-vue',
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
    notifications () {
      return this.$store.getters.notifications
    },
  },
  methods: {
  },
  mounted() {
  }
};
</script>

<style>
  /* CSS */
</style>
