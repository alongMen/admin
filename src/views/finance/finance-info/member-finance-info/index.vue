





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
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="amount">
          {{parsePrice(row.amount)}}
        </template>
        <template slot-scope="{ row }" slot="subAmount">
          {{parsePrice(row.subAmount)}}
        </template>
        <template slot-scope="{ row }" slot="commission">
          {{parsePrice(row.commission)}}
        </template>
        <template slot-scope="{ row }" slot="createTime">
          {{formatBeijingDate(row.createTime)}}
        </template>
        
         <template slot-scope="{ row,index }" slot="actions">
          <Button type="primary"  @click="balance(row)">余额调整</Button>
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
    <Modal :title="title" v-model="showModal" :mask-closable="false">
      <Form ref="balanceForm" :model="form" label-position="top" :rules="rules">
        <FormItem label="调整金额(只能整数)" prop="amount">
          <InputNumber v-model="form.amount"  :precision='0'></InputNumber>
        </FormItem>
        <FormItem label="钱包类型" prop="currency">
          <Select v-model="form.currency">
            <Option v-for="item in currency" :value="item.value" :key="item.value">{{
              item.label
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="原因" prop="reason">
          <Input v-model="form.reason"></Input>
        </FormItem>
        <FormItem label="积分" prop="platformId" v-if='form.currency===4'>
          <Select v-model="form.platformId">
            <Option v-for="item in game_platform_list" :value="item.id" :key="item.id">{{
              item.name
            }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="showModal = false"
          >取消</Button
        >
        <Button type="primary" :loading="btnLoading" @click="ok()">确定</Button>
      </div>
    </Modal>
  </div>
</template>




<script>
import { member_finance_info_list,create_balance_adjust } from '@/service/index';
import {currency} from '@/config/enum'
import mixin from '@/mixins/single-form-mixin'
export default {
  mixins: [mixin],
  data(){
    return{
      currency,
      columns:[
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '昵称',
          key: 'nickName'
        },
        {
          title: '姓名',
          key: 'fullName'
        },
        {
          title: 'idCard',
          key: 'idCard'
        },
        {
          title: '余额',
          slot: 'amount'
        },
        {
          title: '分钱包',
          slot: 'subAmount'
        },
        {
          title: '积分',
          key: 'integration'
        },
        {
          title: '佣金',
          slot: 'commission'
        },
        
        {
          title: '创建时间',
          slot: 'createTime'
        },
        
        {
          title: '操作',
          slot: 'actions',
          width:150
        },
      ],
      form:{},
      title:'',
      rules: {
        amount: [
          { required: true,type:'number' ,message: '请填写金额', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请填写原因', trigger: 'blur' }
        ],
        currency: [
          { required: true,message: '请选择钱包类型',type:'number', trigger: 'change' }
        ],
        platformId: [
          { required: true,message: '请选择分钱包平台',type:'number', trigger: 'change' }
        ],
      },
    }
  },
  computed:{
    game_platform_list() {
      return this.$store.state.base.game_platform_list;
    },
    defaultForm(){
      return [
        {
          label: '用户名',
          type: 'text',
          field: 'userName'
        }
      ]
    }
  },
  methods:{
    balance(row){
      this.title = `余额调整用户：${row.userName}`
      this.showModal = true;
      this.form = {memberId:row.id,amount:0}
    },
    async ok(){
      const valid = await this.$refs.balanceForm.validate();
      if (!valid) return;
      if(!this.form.amount){
        this.$Message.error(`调整金额不能为0`);
      }
      this.btnLoading = true
      const res = await create_balance_adjust(this.form)
      this.btnLoading = false
      if(res.status<400){
        this.$Message.success(`发起余额调整成功成功`);
      }
      this.showModal = false
    },
    async getData() {
      this.loading = true;
      const res = await member_finance_info_list(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
  mounted() {
    if (this.game_platform_list.length === 0) {
      this.$store.dispatch("get_game_platform_list");
    }
    this.currency = this.currency.slice(0,-1);
  },
}
</script>