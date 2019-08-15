<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />
    <div style="width:100%;padding-left:30px;">
      <span style="color:#3b69e2;font-size:16px;">提现总量：{{this.withdraw}}</span>
    </div>
    <div style="width:100%;padding-left:30px;">
      <span style="color:#3b69e2;font-size:16px;">支付报表：</span>
    </div>
    <div style="width: 100%; height: 400px;padding-left:30px;" id="main"></div>
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot="providerName" slot-scope="{ row }">
           <span v-if='row.providerName == 1'>微信</span>
           <span v-if='row.providerName == 2'>支付宝</span>
           <span v-if='row.providerName == 21'>银行</span>
           <span v-if='row.providerName >= 31'>第三方支付</span>
        </template>
         <template slot="accountStatus" slot-scope="{ row }">
           <span v-if='row.accountStatus == 1'>线上支付</span>
           <span v-if='row.accountStatus == 2'>线下支付</span>
        </template>
      </Table>
    </div>

  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import uploadButton from "@/components/upload-button/index";
import {
  get_RechargeWithdraw_sheet
} from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  name: 'ReRFinance',
  mixins: [mixin],
  data() {
    return {
      withdraw:0,
      data: [],
      online:0,
      outline:0,
      wechat:0,
      alipay:0,
      bank:0,
      other:0,
      columns: [
        {
          title: '充值总量',
          key: 'recharge',
        },
        {
          title: '提供商名称',
          slot: 'providerName',
        },
        {
          title: '支付渠道',
          key: 'paymentChannel',
        },
        {
          title: '线上/线下支付',
          slot: 'accountStatus',
        },
      ],
      form: {},
      query: {},
      upperDateOption: {
        disabledDate(date) {
          return date.valueOf() < Date.now() - 86400000;
        },
      },
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          label: "时间段",
          type: "timeRange",
          field: "date"
        },
      ];
    },
    moreForm() {
      return []
    }
  },
  methods: {
    async getData() {

      this.loading = true;
      // console.log(this.query)
      let query = {};
      if(this.query.date[0]){
        query.StartTime = this.query.date[0];
        query.EndTime = this.query.date[1];
      }
      const res = await get_RechargeWithdraw_sheet(query);
      this.loading = false;
      // console.log(res)
      if (res.status === 200) {
        const data = res.data;
        this.data = data.bRechargeReportDtos
        this.withdraw = data.withdraw;
        let onArr = [],outArr = [],wechatArr = [],alipayArr = [],bankArr = [],otherArr = [];
        this.data.forEach((item)=>{
          if(item.providerName == 1){wechatArr.push(item.recharge)}
          else if(item.providerName == 2){alipayArr.push(item.recharge)}
          else if(item.providerName == 21){bankArr.push(item.recharge)}
          else if(item.providerName == 31){otherArr.push(item.recharge)}
          if(item.accountStatus == 1){onArr.push(item.recharge)}else if(item.accountStatus == 2){outArr.push(item.recharge)}
        })
        if(onArr.length>0){
          this.online = onArr.reduce((num,item,index)=>{
            return num+item
          });
        }
        if(outArr.length>0){
        this.outline = outArr.reduce((num,item,index)=>{
          return num+item
        });
        }
        if(wechatArr.length>0){
        this.wechat = wechatArr.reduce((num,item,index)=>{
          return num+item
        });
        }
        if(alipayArr.length>0){
        this.alipay = alipayArr.reduce((num,item,index)=>{
          return num+item
        });
        }
        if(bankArr.length>0){
        this.bank = bankArr.reduce((num,item,index)=>{
          return num+item
        });
        }
        if(otherArr.length>0){
        this.other = otherArr.reduce((num,item,index)=>{
          return num+item
        });
        }
        this.draw();
      }
    },
    draw(){
      let myChartDrawers = this.$echarts.init(document.getElementById('main'));
      // 绘制条形图
      var option = {
        tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['微信','支付宝','银联','第三方支付']
    },
    series: [
        {
            name:'支付方式',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:this.online, name:'线上', selected:true},
                {value:this.outline, name:'线下'},
            ]
        },
        {
            name:'支付方式',
            type:'pie',
            radius: ['40%', '55%'],
            label: {
                normal: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    shadowBlur:3,
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            data:[
                {value:this.wechat, name:'微信'},
                {value:this.alipay, name:'支付宝'},
                {value:this.bank, name:'银联'},
                {value:this.other, name:'第三方支付'}
            ]
        }
    ]
      };
      myChartDrawers.setOption(option);
    }
  },
  mounted(){

  }
};
</script>

