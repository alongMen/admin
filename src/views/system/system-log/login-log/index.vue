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

        <template slot="userType" slot-scope="{ row }">
          <span v-if="row.userType === 1">管理员</span>
          <span v-if="row.userType === 2">会员</span>
          <!-- <span v-if='row.userType===3'></span> -->
        </template>
        <template slot="siteType" slot-scope="{ row }">
          <span v-if="row.siteType === 1">总后台</span>
          <span v-if="row.siteType === 2">商户后台</span>
          <span v-if="row.siteType === 3">PC</span>
          <span v-if="row.siteType === 4">WAP</span>
          <span v-if="row.siteType === 5">Andriod</span>
          <span v-if="row.siteType === 6">IOS</span>
        </template>

        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }}</span>
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
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import { get_login_log_list } from '@/service/index';
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
        {
          title: '用户类型',
          slot: 'userType',
        },
        {
          title: '站点类型',
          slot: 'siteType',
        },
        {
          title: '登录站点',
          key: 'loginSite',
        },
        {
          title: '登录IP',
          key: 'loginIP',
        },

        {
          title: '登陆时间',
          slot: 'createTime',
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
      const res = await get_login_log_list(this.page, this.limit, query);
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
