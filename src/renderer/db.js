import { getFormatDate } from './utils/index';
import config from './config/index';
const electron = require('electron');
const Datastore = require('nedb');
const path = require('path');
const { defaultSetting } = config;

const pathPre = (electron.app || electron.remote.app).getPath('userData');
// /Users/nali/Library/Application Support/Electron

export const settingDb = new Datastore({
  filename: path.join(pathPre, '/pomodoro/settingDb.db'),
  autoload: true,
});
export const chartDb = new Datastore({
  filename: path.join(pathPre, '/pomodoro/chartDb.db'),
  autoload: true,
});

// 初始化默认数据
export function initDb() {
  const defaultData = {
    name: 'setting',
    ...defaultSetting,
  };
  settingDb.find({
    name: 'setting',
  }, (err, doc) => {
    console.log('nedb=> initDb 查询setting', doc);
    if (doc.length === 0) {
      settingDb.insert(defaultData, (err, doc) => {
        console.log('nedb=> 初始化数据库', doc);
        if (err) {
          console.log('nedb error=>', err);
        }
      });
    }
  });
}

export function querySetting(callback) {
  settingDb.find({
    name: 'setting',
  }, (err, doc) => {
    callback(doc[0]);
  });
}

export function updateSetting(key, val) {
  settingDb.update({ name: 'setting' }, { $set: { [key]: val } }, {}, (err, numReplaced) => {
    console.log('nedb=> 更新数据', numReplaced);
  });
}

export function queryChartData(callback) {
  chartDb.findOne({ name: 'chartdata' }, (err, doc) => {
    if (doc) {
      callback(doc);
    } else {
      callback('');
    }
  });
}
/*
{
  type: 1, 0放弃 1完成 2提前完成
}
*/
export function saveChartData(option) {
  const { type } = option;
  queryChartData((res) => {
    const date = getFormatDate('YYYY-MM-DD');
    if (res) {
      console.log('queryChartData', res);
      const todyData = res[date];
      let data;
      if (todyData) {
        const {
          work, fail, success, ahead,
        } = todyData;
        data = {
          ...res,
          [date]: {
            ...todyData,
            work: work + 1,
            fail: type === 0 ? fail + 1 : fail,
            success: (type === 1 || type === 2) ? success + 1 : success,
            ahead: type === 2 ? ahead + 1 : ahead,
          },
        };
      } else {
        data = {
          ...res,
          [date]: {
            work: 1,
            fail: type === 0 ? 1 : 0,
            success: (type === 1 || type === 2) ? 1 : 0,
            ahead: type === 2 ? 1 : 0,
          },
        };
      }

      chartDb.update({ name: 'chartdata' }, data, {}, (err, numReplaced) => {
        console.log('nedb=> 更新数据', numReplaced);
        if (err) console.log(err);
      });
    } else {
      console.log('nedb=> 初始化chart数据');
      const data = {
        name: 'chartdata',
        [date]: {
          work: 1,
          fail: type === 0 ? 1 : 0,
          success: (type === 1 || type === 2) ? 1 : 0,
          ahead: type === 2 ? 1 : 0,
        },
      };
      chartDb.insert(data, (err) => {
        console.log('nedb err=>', err);
      });
    }
  });
}
