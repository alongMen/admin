<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="[]"
      v-model="query"
    />
    <div class="table-area">
      <div id="myChart"></div>
      <Table :columns="columns" :data="data" :loading="loading">
        <template
          slot-scope="{ row }"
          slot="plateFormType"
        >
        <!-- {{row.plateFormType}} -->
            <span
              v-for="(items, index) in game_platform"
              :key="index"
              v-if="row.plateFormType == items.value"
              >{{ items.label }}</span
            >
        </template>
      </Table>
    </div>

  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import { get_RGame_sheet } from '@/service/index';
import { game_platform } from '@/config/enum';
import { cloneDeep } from 'lodash';
import { setTimeout } from 'timers';
export default {
  name:'RGame',
  mixins: [mixin],
  data() {
    return {
      game_platform,
      typeList:[],
      betList:[],
      winList:[],
      winOrLoseList:[],
      columns: [
        {
          title: '平台',
          slot: 'plateFormType',
        },
        {
          title: '下注',
          key: 'bet',
        },
        {
          title: '赢取',
          key: 'win',
        },
      ],
      form: {},
      query: {
        date: [],
      },
      option:{},
      myChartDrawer:Object
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          label: '时间',
          field: 'date',
          type: 'timeRange',
        },
        {
          type: 'select',
          label: '游戏平台',
          options: this.game_platform,
          field: 'platFormType'
        },
      ];
    },
  },
  methods: {
    async getData() {
      this.loading = true;
      let query = {
        platFormType:this.query.platFormType,
      };
      if(this.query.date[0]){
          query.startTime=this.query.date[0];
          query.endTime=this.query.date[1];
      }
      // console.log(query);
      this.betList =[];
      this.winList = [];
      this.typeList = [];
      const res = await get_RGame_sheet(query);
      this.loading = false;
      if (res.status === 200) {
        const data = res.data;
        this.data = data;
        if(this.data !== []){
          this.data.forEach((item)=>{
            this.game_platform.forEach(it=>{
              if(item.plateFormType == it.value){
                this.typeList.push(it.label);
                }
            })
            this.betList.push(item.bet);
            this.winList.push(item.win);
            this.winOrLoseList.push((item.win-item.bet).toFixed(2));
          });
          this.option  = {
              title: {
                  text: '游戏盈亏报表',
                  top: 5,
                  left: 'center'
              },
              legend: {
                  data:['赢取', '下注'],
                  top: 30
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis : [
                  {
                      type : 'value'
                  }
              ],
              yAxis : [
                  {
                      type : 'category',
                      axisTick : {show: false},
                      data : this.typeList
                  }
              ],
              series : [
                  {
                      name:'赢取',
                      type:'bar',
                      label: {
                          normal: {
                              show: true,
                              position: 'inside'
                          }
                      },
                      data:this.winList
                  },
                  {
                      name:'下注',
                      type:'bar',
                      stack: '总量',
                      label: {
                          normal: {
                              show: true,
                              position: 'right'
                          }
                      },
                      data:this.betList
                  }
              ]
          };
          // console.log(document.getElementById('myChart').getOption());
          this.renderChart(this.option);
        }else{
          this.renderChart({})
        }
      }
    },
    initChart(){
        this.myChartDrawer = this.$echarts.init(document.getElementById('myChart'));
        // window.addEventListener('resize', ()=>{
        //   this.chart.resize();
        // })
    },
    renderChart(option){
      this.myChartDrawer.setOption(option, true);
    }
  },
  mounted(){
    this.initChart();
  }
};
</script>
<style lang="less" scoped>
    #myChart {
        width: 70%;
        min-height: 300px;
        clear: both;
        box-sizing: border-box;
        margin: 30px auto;
    }
  
</style>
