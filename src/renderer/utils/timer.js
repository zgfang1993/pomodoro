import Event from './event';
const Timer = require('easytimer.js');
export default class {
  constructor(min) {
    this.timeSeconds = min * 60;
    this.time = min * 60;
  }

  start() {
    if (this.timer) return;

    this.timer = new Timer();
    this.timer.start({countdown: true, startValues: {seconds: this.time}});
    this.timer.addEventListener('secondsUpdated', (e) => {
      const { minutes, seconds } = this.timer.getTimeValues();
      this.time = minutes*60 + seconds;
      Event.$emit('time-update', this.timeSeconds, this.time);
    });
    // 完成
    this.timer.addEventListener('targetAchieved', (e) => {
      Event.$emit('time-end', {});
    });
    Event.$emit('time-start');
  }

  pause() {
    if(this.timer){
      this.timer.stop();
      delete this.timer;
    }
    Event.$emit('time-pause');
  }

  reset() {
    if(this.timer){
      this.timer.stop();
      delete this.timer;
    }
    // 清空time
    this.time = 0;
  }
}
