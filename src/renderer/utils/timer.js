import Event from './event';

export default class {
  constructor(min) {
    this.time = 0;
    this.timeSeconds = min * 60;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.time += 1;
      // 未完成
      if (this.timeSeconds > this.time) {
        Event.$emit('time-update', this.timeSeconds, this.time);
      } else {
        this.pause();
        Event.$emit('time-end', {});
      }
    }, 1000);
    Event.$emit('time-start');
  }

  pause() { // 不会清空time
    clearInterval(this.timer);
    delete this.timer;
    Event.$emit('time-pause');
  }

  reset() { // 清空time
    clearInterval(this.timer);
    delete this.timer;
    this.time = 0;
  }
}
