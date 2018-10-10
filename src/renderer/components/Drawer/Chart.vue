<template>
  <div class="data-center">
    <a href="" download="pomodoro数据统计.xlsx" id="hf"></a>
    <i class="iconfont icon-export" @click="exportData" title="导出"></i>
    <div class="today-board board">
      <div>
        <span>{{dayData.work}}</span>
        <h5>总关注数</h5>
      </div>
      <div>
        <span>{{dayData.success}}</span>
        <h5>已完成数</h5>
      </div>
      <div>
        <span>{{dayData.fail}}</span>
        <h5>放弃数</h5>
      </div>
      <div>
        <span>{{dayData.ahead}}</span>
        <h5>提前完成数</h5>
      </div>
    </div>
    <div class="chart-board board">
      <ve-histogram height="250px" 
        :data="chartData" 
        :settings="chartSettings" 
        :extend="chartExtend"
        :data-empty="dataEmpty" ></ve-histogram>
      <div class="chart-controll">
        <i class="iconfont icon-prev" @click="prevPage"></i>
        <i class="iconfont icon-next" @click="nextPage" :class="page ? '' : 'disabled'"></i>
        <i class="iconfont icon-refresh" @click="refreshPage"></i>
        <p class="date">{{dateRange}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { queryChartData } from '../../db.js'
import { getFormatDate } from '../../utils/index.js'
import XLSX from 'xlsx'

export default {
  data() {
    return {
      dayData: {
        work: 0,
        success: 0,
        fail: 0,
        ahead: 0
      },
      exportdata:{},
      page: 0,
      // endDate: getFormatDate('YYYY-MM-DD'),
      // startDate: getFormatDate('YYYY-MM-DD', new Date( new Date().getTime() - 6*24*60*60*1000)),
      chartSettings: {
        stack: { '总关注数': ['完成数', '放弃数'], '完成数': ['提前完成数'] }
      },
      chartExtend: {
        legend: {
          itemWidth: 12,
          itemHeight: 8
        },
        xAxis: {
          show: false,
        },
        grid:{
          height: 200,
          y: 60,
          y2: 10
        },
        series: {
          barCategoryGap: 8,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type : 'shadow',
            shadowStyle: {
              color: 'rgba(0,0,0,0.05)'
            }
          } 
        }
      },
      chartData: {
          columns: ['日期', '总关注数', '完成数', '提前完成数','放弃数'],
          rows: [] // { '日期': '2018/09/01', '总关注数': 10, '完成数': 6, '提前完成数': 2,'放弃数': 4, },
        }
    }
  },
  components: {
  },
  computed: {
    dataEmpty() {
      return this.chartData.rows.length ? false : true;
    },
    dateRange() {
      const page = this.page;
      const date = new Date().getTime(); 
      this.endDate = new Date(date - page*7*24*60*60*1000).getTime();
      this.startDate = this.endDate - 6*24*60*60*1000;
      const formatDateStart = getFormatDate('YYYY-MM-DD', new Date(this.startDate)).slice(5);
      const formatDateEnd = getFormatDate('YYYY-MM-DD', new Date(this.endDate)).slice(5);

      return `${formatDateStart} - ${formatDateEnd}`;
    }
  },
  methods: {
    initData() {
      this.getRows({day: true});
    },
    prevPage() {
      this.page ++;
      this.getRows();
    },
    nextPage() {
      if(this.page){
        this.page --;
        this.getRows();
      }
    },
    refreshPage() {
      this.page = 0;
      this.getRows();
    },
    getRows(option) {
      queryChartData((res)=>{
        if(res){
          console.log('res=>', res)
          // 获取今日数据
          if(option && option.day){
            const date = getFormatDate('YYYY-MM-DD');
            this.exportdata = res;
            delete this.exportdata['name'];
            delete this.exportdata['_id'];
            if(res[date]){
              const { work, success, fail, ahead} = res[date];
              this.dayData.work = work;
              this.dayData = {
                work,
                success,
                fail,
                ahead
              } 
            }
          }
            
          // 获取每页7日数据
          const rows = [];
          for(let i = 0; i < 7; i++){
            const date = getFormatDate('YYYY-MM-DD', new Date(this.startDate + i*24*60*60*1000));
            let obj;
            if(res[date]){
              const { work, success, fail, ahead} = res[date];
              obj = {
                '日期': date, 
                '总关注数': work, 
                '完成数': success, 
                '提前完成数': ahead,
                '放弃数': fail
              };
            }else {
              obj = {
                '日期': date, 
                '总关注数': 0, 
                '完成数': 0, 
                '提前完成数': 0,
                '放弃数': 0
              };
            }
            
            rows.push(obj);
          }
          this.chartData.rows = rows;
          console.log('rows=>', rows)
        }
      });
    },
    exportData() {
      const tmpdata = [];
      tmpdata['A1'] = {v: ""};
      tmpdata['B1'] = {v: "关注数"};
      tmpdata['C1'] = {v: "失败数"};
      tmpdata['D1'] = {v: "完成数"};
      tmpdata['E1'] = {v: "提前完成数"};

      Object.keys(this.exportdata).forEach((key, i) => {
        console.log(key)
        if(key !== 'name' && key !== '_id'){
          const index = i+2;
          const data = this.exportdata[key];
          tmpdata[`A${index}`] = {v: key};
          tmpdata[`B${index}`] = {v: data['work']};
          tmpdata[`C${index}`] = {v: data['fail']};
          tmpdata[`D${index}`] = {v: data['success']};
          tmpdata[`E${index}`] = {v: data['ahead']};

        }
      });        
      var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
      var wb = {
        SheetNames: ['统计'],
        Sheets: {
          '统计': Object.assign({},
          tmpdata,
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1]
          })
        }
      };
      const tmpDown = new Blob([this.s2ab(XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: false,
          type: 'binary'
        }
      ))], {
        type: ""
      });

      // 下载
      var href = URL.createObjectURL(tmpDown);
      document.getElementById("hf").href = href;
      document.getElementById("hf").click();

      //用URL.revokeObjectURL()来释放这个object URL
      setTimeout(function () {
        URL.revokeObjectURL(tmpDown); 
      }, 100);

    },
    s2ab(s) { //字符串转字符流
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }

      return buf;
    }
  },
  mounted() {
    this.initData();
  }
}
</script>

<style lang="scss">
  .data-center {
    padding: 10px 20px 80px 20px;
    height: 100%;
    overflow: auto;
    .icon-export {
      font-size: 20px;
      position: absolute;
      top: 17px;
      left: 40px;
      color: $colorPrimary;
      cursor: pointer;
    }
  }
  .board {
    padding: 10px;
    margin-bottom: 20px;
  }
  .today-board {
    display: flex;
    flex-direction: row;
    padding: 20px 10px;
    border-bottom: 1px solid #e3e3e3;
    
    > div {
      width: 25%;
      text-align: center;
      span {
        color: $colorPrimary;
        font-size: 30px;
      }
      h5 {
        color: $colorTip;
        margin: 10px 0 0 0;
      }
    }
  }
  .chart-board {
    .chart-controll {
      padding-top: 10px;
      font-size: 12px;
      i {
        color: $colorPrimary;
        cursor: pointer;
        user-select: none;
      }
      i.icon-refresh {
        margin-left: 10px;
      }
      i.disabled {
        color: $colorTip;
      }
      .date {
        float: right;
        color: $colorPrimary;
      }
    }
  }
</style>