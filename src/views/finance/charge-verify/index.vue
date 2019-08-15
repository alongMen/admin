<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />

    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading" >
        <!-- <template slot-scope="{ row }" slot="accountMode">
          <span>{{ row.accountMode === 1 ? "银行卡" : "扫码" }} </span>
        </template> -->
        <template slot-scope="{ row }" slot="amount">
          <span>{{ parsePrice(row.amount+row.random) }} </span>
        </template>
        <template slot-scope="{ row }" slot="total">
          <span>{{ parsePrice(row.total) }} </span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
           {{formatBeijingDate(row.createTime)}}
        </template>
         <template slot-scope="{ row }" slot="rechargeStatus">
          <Tag color='orange' v-if='row.rechargeStatus === 1'>待处理</Tag>
          <Tag color='green' v-if='row.rechargeStatus === 2'>通过</Tag>
          <Tag color='red' v-if='row.rechargeStatus === 3'>拒绝</Tag>
           <Tag color='red' v-if='row.rechargeStatus === 4'>失败</Tag>
        </template>
        <template slot-scope="{ row,index }" slot="action" v-if='row.rechargeStatus===1 || row.providerName <31'>
           <Button type="success" @click='pass(row,index)' :loading="btnLoading">通过</Button>&nbsp;
           <Button type="error" @click='reject(row,index)' :loading="btnLoading">拒绝</Button>
        </template>
      </Table>
      <div class="pagination">
        <Page
          :total="total"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
          show-total
        />
      </div>
    </div>
  </div>
</template>




<script>
import { get_charge_page,set_state_charge } from '@/service/index';
import expandRow from './component/expand.vue';
import mixin from '@/mixins/single-form-mixin'
export default {
  mixins: [mixin],
  name: 'charge-verify',
  components: { expandRow },
  data(){
    return{
      columns:[
        {
          title:'详情',
          type: 'expand',
          width: 60,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '订单号',
          key: 'orderNo'
        },
        {
          title: '玩家用户名',
          key: 'userName'
        },
        // {
        //   title: '账户方式',
        //   slot: 'accountMode'
        // },
        {
          title: '提供商',
          key: 'providerDisplay'
        },
        {
          title: '支付渠道',
          key: 'paymentChannel'
        },
     
        {
          title: '附言码',
          key: 'attachCode'
        },
        {
          title: '充值金额',
          slot: 'amount'
        },
        {
          title: '实际到账',
          slot: 'total'
        },
        {
          title: '状态',
          slot: 'rechargeStatus'
        },
        {
          title: '创建时间',
          slot: 'createTime'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ]
    }
  },

  computed:{
    providerNames() {
      return this.$store.state.base.provider_names;
    },
    defaultForm(){
      return [
        {
          label: '时间',
          field: 'date',
          type: 'timeRange',
        },
        {
          type: 'select',
          label: '提供商',
          options: this.providerNames,
          field: 'providerName'
        },
        {
          type: 'select',
          label: '状态',
          options: [
              {label:'待处理',value:1},
              {label:'通过',value:2},
               {label:'拒绝',value:3},
               {label:'关闭',value:4},
          ],
          field: 'rechargeStatus'
        },
      ]
    },
    moreForm(){
      return [
         {
          label: '用户名',
          field: 'userName',
          type: 'text',
        },
        {
          label: '支付渠道',
          field: 'paymentChannel',
          type: 'text',
        },
        {
          label: '订单号',
          field: 'orderNo',
          type: 'text',
        },
        {
          label: '附言码',
          field: 'attachCode',
          type: 'text',
        },
      ]
    }
  },
  methods:{
    pass(row,index){
      let remark = row.remark;
      this.$Modal.confirm({
        title: `通过该充值订单：${row.orderNo}？`,
        render: h => {
          return h("Input", {
            loading: true,
            props: {
              value: remark,
              autofocus: true,
              placeholder: "请输入备注",
              require: true
            },
            on: {
              input: val => {
                remark = val;
              }
            }
          });
        },
        onOk: async () => {
          this.btnLoading=true
          const res = await set_state_charge(row.id,1,remark);
          this.btnLoading=false
          if (res.status < 400) {
            this.$Message.success(`已通过充值订单：${row.orderNo}`);
            row.auditOpinion = remark
            row.rechargeStatus = 2
            this.data.splice(index,1,row);
          } else {
            this.$Modal.remove();
          }
        }
      });
    },
    reject(row,index){
      let remark = row.remark;
      this.$Modal.confirm({
        title: `拒绝该充值订单：${row.orderNo}？`,
        render: h => {
          return h("Input", {
            loading: true,
            props: {
              value: remark,
              autofocus: true,
              placeholder: "请输入备注",
              require: true
            },
            on: {
              input: val => {
                remark = val;
              }
            }
          });
        },
        onOk: async () => {
          this.btnLoading=true
          const res = await set_state_charge(row.id,2,remark);
          this.btnLoading=false
          if (res.status < 400) {
            this.$Message.success(`已拒绝充值订单：${row.orderNo}`);
            row.auditOpinion = remark
            row.rechargeStatus = 3
            this.data.splice(index,1,row);
          } else {
            this.$Modal.remove();
          }
        }
      });
    },
    selectRow(row,index){
      row._expanded = !row._expanded
      this.data.splice(index,1,row);
    },
    
    async getData() {
      this.loading = true;
      const query = {
        accountMode:this.query.accountMode,
        rechargeStatus:this.query.rechargeStatus,
        orderNo:this.query.orderNo,
        fullName:this.query.fullName,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      }
      const res = await get_charge_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
        this.data.forEach(v=>{
          v._expanded=false;
        })
      }
    },
  },
  mounted() {
    if (this.providerNames.length === 0) {
      this.$store.dispatch('get_provider_names');
    }
    // if (this.bank_list.length === 0) {
    //   this.$store.dispatch("get_bank_list");
    // }
    // if (this.qrcode_list.length === 0) {
    //   this.$store.dispatch("get_qrcode_list");
    // }
  }
}
</script>