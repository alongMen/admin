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
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="preAmount">
          {{parsePrice(row.preAmount)}}
        </template>
        <template slot-scope="{ row }" slot="amount">
          {{parsePrice(row.amount)}}
        </template>
        <template slot-scope="{ row }" slot="balance">
          {{parsePrice(row.balance)}}
        </template>
        <template slot-scope="{row}" slot="balanceChangeStatus">
          <span v-if="row.balanceChangeStatus === 2">
            <Tag color='green'>通过</Tag>
          </span>
          <span v-else-if="row.balanceChangeStatus === 3">
             <Tag color='red'>拒绝</Tag>
          </span>
           <span v-else>
             <Tag color='orange'>审核</Tag>
          </span>
        </template>
        <template slot-scope="{row}" slot="currency">
          <span v-if="row.currency === 1">
            <Tag color='green'>余额</Tag>
          </span>
          <span v-else-if="row.currency === 2">
             <Tag color='blue'>积分</Tag>
          </span>
          <span v-else-if="row.currency === 3">
             <Tag color='red'>佣金</Tag>
          </span>
           <span v-else>
             <Tag color='orange'>分钱包</Tag>
          </span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          {{formatBeijingDate(row.createTime)}}
        </template>
         <template slot-scope="{ row }" slot="auditTime">
          {{formatBeijingDate(row.auditTime)}}
        </template>
        <template slot-scope="{ row }" slot="actions">
         <template v-if='row.balanceChangeStatus===1'>
           <Button type="primary"  @click='pass(row)'>通过</Button>&nbsp;
           <Button type="error"  @click='refuse(row)'>拒绝</Button>
         </template>
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
import mixin from '@/mixins/single-form-mixin';
import {currency,balanceChangeStatus} from '@/config/enum'
import { get_balance_adjust_list,handle_balance_adjust_status } from '@/service/index';
export default {
  mixins: [mixin],
  data(){
    return{
      columns:[
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '订单号',
          key: 'orderNo'
        },
        {
          title: '调整前的金额',
          slot: 'preAmount'
        },
        {
          title: '调整金额',
          slot: 'amount'
        },
        {
          title: '调整后金额',
          slot: 'balance'
        },
        {
          title: '类型',
          key: 'currency',
          slot: 'currency'
        },
        {
          title: '状态',
          slot: 'balanceChangeStatus'
        },
        {
          title: '原因',
          key: 'reason'
        },
        {
          title: '创建时间',
          slot: 'createTime'
        },
        {
          title: '审核时间',
          slot: 'auditTime'
        },
        {
          title: '审核意见',
          key: 'auditOpinion'
        },
        {
          title: '操作',
          slot: 'actions',
          width:180,
        }
        
      ]
    }
  },
  computed:{
    defaultForm(){
      return[
        {
          label: '时间',
          type: 'timeRange',
          field: 'date',
        },
        {
          label: '订单号',
          type: 'text',
          field: 'orderNo',
        },
        {
          type: 'select',
          label: '类型',
          options: currency,
          field: 'currency'
        },
      ]
    },
    moreForm(){
      return [
        {
          label: '用户名',
          type: 'text',
          field: 'UserName',
        },
        {
          type: 'select',
          label: '状态',
          options: balanceChangeStatus,
          field: 'balanceChangeStatus'
        },
      ]
    }
  },
  methods:{
    pass(row){
      let remark
      this.$Modal.confirm({
        title: "余额调整通过",
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
          const res = await handle_balance_adjust_status(row.id,1,remark);
          if (res.status < 400) {
            this.$Message.success(`通过余额调整`);
            this.getData()
          } else {
            this.$Modal.remove();
          }
        }
      });
    },
    refuse(row){
      let remark
      this.$Modal.confirm({
        title: "余额调整拒绝",
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
          const res = await handle_balance_adjust_status(row.id,2,remark);
          if (res.status < 400) {
            this.$Message.success(`拒绝余额调整`);
            this.getData()
          } else {
            this.$Modal.remove();
          }
        }
      });
    },
    async getData(){
      this.loading = true;
      const query = {
        orderNo: this.query.orderNo,
        currency: this.query.currency,
        balanceChangeStatus: this.query.balanceChangeStatus,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      }
      const res = await get_balance_adjust_list(this.page , this.limit , query);
      this.loading = false;
      if(res.status  <400 ){
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    }
  },
}
</script>