<template>
  <div class="drawer">
    <transition name="fade" mode="out-in">
      <component :is="currentDrawer"/>
    </transition>
    <div class="tabs">
      <div class="tab" @click="setCompoment('Setting')" :class="{'active' : currentDrawer === 'Setting'}"><span>设置</span></div>
      <div class="tab" @click="setCompoment('Chart')" :class="{'active' : currentDrawer === 'Chart'}"><span>统计</span></div>
    </div>
  </div>
</template>


<script>
import Setting from '@/components/Drawer/Setting';
import Chart from '@/components/Drawer/Chart';

export default {
  components: {
    Setting,
    Chart,
  },
  computed: {
    currentDrawer() {
      return this.$store.getters.currentDrawer;
    },
  },
  methods: {
    setCompoment(component) {
      const payload = {
        key: 'currentDrawer',
        val: component,
      };
      this.$store.dispatch('setSettingState', payload);
    },
  },

};
</script>
<style lang="scss">
.drawer {
  width: 100%;
  height: 100%;
}
.tabs {
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  color: $colorPrimary;
  background: #fff;
  .tab {
    flex: 1;
    padding: 10px 0;
    text-align: center;
    cursor: pointer;
    span {
      font-size: 14px;
      padding: 5px 0;
    }
  }
  .tab.active span{
    border-bottom: 2px solid $colorPrimary;
  }
}
</style>
