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
        <template slot-scope="{ row }" slot="link">
          <a :href="row.link">{{ row.link }}</a>
        </template>

        <!-- <template slot="accountType" slot-scope="{ row }">
          <span v-if="row.accountType === 1">管理员</span>
          <span v-if="row.accountType === 2">商户</span>
          <span v-if="row.accountType === 3">会员</span>
          <span v-if="row.accountType === 4">代理</span>
        </template> -->

        <template slot="operateType" slot-scope="{ row }">
          <span v-if="row.operateType === 1">选择</span>
          <span v-if="row.operateType === 2">添加</span>
          <span v-if="row.operateType === 3">删除</span>
          <span v-if="row.operateType === 4">修改</span>
        </template>

        <template slot="operateStatus" slot-scope="{ row }">
          <span v-if="row.operateStatus === 1">成功</span>
          <span v-if="row.operateStatus === 2">失败</span>
        </template>
        <!-- <template slot="loginType" slot-scope="{ row }">
          <span v-if="row.loginType === 1">总后台</span>
          <span v-if="row.loginType === 2">商户后台</span>
          <span v-if="row.loginType === 3">pc</span>
          <span v-if="row.loginType === 4">wap</span>
          <span v-if="row.loginType === 5">安卓</span>
          <span v-if="row.loginType === 6">ios</span>
        </template> -->

        <template slot-scope="{ row }" slot="operateTime">
          <span>{{ formatBeijingDate(row.operateTime) }}</span>
        </template>
      </Table>
      <div class="pagination" v-if="total > 0">
        <Page
          :total="10"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import { get_operation_log_list } from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  name: 'operation-log',
  mixins: [mixin],
  data() {
    return {
      data: [],
      columns: [
        {
          title: '登录名称',
          key: 'loginName',
        },
        // {
        //   title: '账号类型',
        //   slot: 'accountType',
        // },
        {
          title: '操作类型',
          slot: 'operateType',
        },
        // {
        //   title: '登录类型',
        //   slot: 'loginType',
        // },
        {
          title: '操作IP',
          key: 'operateIP',
        },
        {
          title: '操作状态',
          slot: 'operateStatus',
        },
        // {
        //   title: '请求站点',
        //   key: 'requestSite',
        // },
        // {
        //   title: '请求方式',
        //   key: 'requestMethod',
        // },
        // {
        //   title: '提交方式',
        //   key: 'submitMethod',
        // },
        {
          title: '描述',
          key: 'description',
        },
        {
          title: '操作时间',
          slot: 'operateTime',
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
          label: '时间段',
          type: 'timeRange',
          field: 'date',
        },
      ];
    },
  },
  methods: {
    async getData() {
      this.loading = true;
      const query = {
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      };
      const res = await get_operation_log_list(this.page, this.limit, query);
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
