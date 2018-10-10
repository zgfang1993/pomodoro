<template>
</template>

<script>
import EVENT from '@/utils/event';
const path = require('path');
// const iconPath = path.join(__dirname, '../img/IconTemplate.png');
export default {
  data() {
    return {
      notification: null,
    };
  },
  methods: {
    alertNotice(option) {
      this.notification = new window.Notification(option.title, option);
    },
    notifyWork() {
      const option = {
        title: '休息结束啦',
        body: '即将开始新的关注',
        // icon: iconPath
      }; this.notification = new window.Notification(option.title, option);
      this.alertNotice(option);
    },
    notifyShortBreak() {
      const option = {
        title: '关注结束',
        body: '恭喜，又度过了一段专注时光。现在可以短暂休息一会^_^',
        // icon: iconPath
      };
      this.alertNotice(option);
    },
    notifyLongBreak() {
      const option = {
        title: '关注结束',
        body: '恭喜，又度过了一段专注时光',
        // icon: iconPath
      };
      this.alertNotice(option);
    },
  },
  mounted() {
    EVENT.$on('start-work', this.notifyWork);
    EVENT.$on('start-short-break', this.notifyShortBreak);
    EVENT.$on('start-long-break', this.notifyLongBreak);
  },
  beforeDestroy() {
    EVENT.$off('start-work', this.notifyWork);
    EVENT.$off('start-short-break', this.notifyShortBreak);
    EVENT.$off('start-long-break', this.notifyLongBreak);
  },
};
</script>
