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
         <template slot="actions" slot-scope="{ row }">
          <Button type="primary" v-if="!row.isDefault" @click="childRAgent(row)">下级代理</Button>
        </template>
      </Table>
      <div class="pagination" v-if="total > 0">
        <Page
          :total="total"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
        />
      </div>
    </div>
 
     <Drawer
      title="下级代理报表"
      width="70"
      v-model="showAside"
    >
      <childRAgent
        :form="form"
        v-if="showAside"
        ref="roleForm"
      />
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import childRAgent from './components/childRAgent'
import { get_RAgent_sheet } from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  components:{
    childRAgent
  },
  name: 'operation-log',
  mixins: [mixin],
  data() {
    return {
      showAside: false,
      data: [],
      columns: [
        {
          title: '代理用户名',
          key: 'userName',
        },
        {
          title: '上级用户名',
          key: 'parentName',
        },
        {
          title: '今日注册数',
          key: 'todayRegisterNum',
        },
        {
          title: '今日充值',
          key: 'todayRechargeTotal',
        },
        {
          title: '下级当前总余额',
          key: 'childTotalBalance',
        },
        {
          title: '下级总充值',
          key: 'childTotalRecharge',
        },
        {
          title: '下级总提现',
          key: 'childTotalWithdraw',
        },
        {
          title: '下级人数',
          key: 'childNum',
        },
        {
          title: '总俑金',
          key: 'totalCommission',
        },
        {
          title: '已提现俑金',
          key: 'totalWithdrawCommission',
        },
        {
          title: '备注',
          key: 'remark',
        },
        {
          title: '操作',
          slot: 'actions',
        },
      ],
      form: {},
      query: {
        date: [],
      },
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          label: '代理账号',
          type: 'text',
          field: 'UserName'
        },
        {
          label: '上级账号',
          type: 'text',
          field: 'ParentName'
        },
      ];
    },
  },
  methods: {
    childRAgent(row){
      this.form = cloneDeep(row);
      // console.log(this.form)
      this.showAside = true;
    },
    async getData() {
      this.loading = true;
      const res = await get_RAgent_sheet(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status === 200) {
        const data = res.data;
        this.data = data.itemList;
        this.total = data.itemTotal;
      }
    },
  },
};
</script>
