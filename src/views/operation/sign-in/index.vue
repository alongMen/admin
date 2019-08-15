<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />
    <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div>
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>&nbsp;
        </template>
        <template slot-scope="{ row }" slot="signWeek">
          <span v-if="row.signWeek === 1">周一</span>
          <span v-if="row.signWeek === 2">周二</span>
          <span v-if="row.signWeek === 3">周三</span>
          <span v-if="row.signWeek === 4">周四</span>
          <span v-if="row.signWeek === 5">周五</span>
          <span v-if="row.signWeek === 6">周六</span>
          <span v-if="row.signWeek === 7">周日</span>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <i-switch
            v-model="row.status"
            :true-value="1"
            :false-value="2"
            size="large"
            @on-change="value => setState(value, row, index)"
            :loading="btnLoading"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          {{ formatBeijingDate(row.createTime) }}
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
    <Drawer :title="title" v-model="showModal" width="70">
      <edit-form :form="form" v-if="showModal" ref="form" />
      <div class="drawer-footer">
        <Button @click="showModal = false" style="margin-right: 8px"
          >取消</Button
        >
        <Button type="primary" :loading="btnLoading" @click="oks">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_BSignIn_list_page,
  add_BSignIn,
  edit_BSignIn,
  switch_BSignIn,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import EditForm from './components/edit-form';
export default {
  name: 'sign-in',
  mixins: [mixin],
  components: {
    EditForm,
  },
  data() {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
        },
        {
          title: '星期',
          slot: 'signWeek',
        },
        {
          title: '红包',
          key: 'amount',
        },
        {
          title: '积分',
          key: 'integration',
        },
        {
          title: '创建时间',
          slot: 'createTime',
        },
        {
          title: '状态',
          slot: 'status',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 240,
        },
      ],
      title: '',
      form: {},
      signWeek: [
        {
          label: '周一',
          value: 1,
        },
        {
          label: '周二',
          value: 2,
        },
        {
          label: '周三',
          value: 3,
        },
        {
          label: '周四',
          value: 4,
        },
        {
          label: '周五',
          value: 5,
        },
        {
          label: '周六',
          value: 6,
        },
        {
          label: '周日',
          value: 7,
        },
      ],
    };
  },
  computed: {
    defaultForm() {
      return [];
    },
    moreForm() {
      return [];
    },
  },
  methods: {
    add() {
      this.title = '添加签到';
      this.showModal = true;
      this.form = {
        amount: 0,
        integration: 0,
      };
    },
    edit(row) {
      this.title = '编辑签到';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    async oks() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      if (this.form.id) {
        const res = await edit_BSignIn(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('更新签到成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.success(res);
        }
      } else {
        const res = await add_BSignIn(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加签到成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.success(res);
        }
      }
    },
    async setState(value, row, index) {
      let state;
      let title;
      if (value === 1) {
        state = 1;
        title = '开启';
      } else {
        state = 2;
        title = '关闭';
      }
      this.$Modal.confirm({
        title: `${title}等级`,
        loading: true,
        content: `<p>是否${title}该签到</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await switch_BSignIn(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}签到成功`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value === 1) {
              row.status = 2;
            } else {
              row.status = 1;
            }
            this.data.splice(index, 1, row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value === 1) {
            row.status = 2;
          } else {
            row.status = 1;
          }
          this.data.splice(index, 1, row);
        },
      });
    },
    async getData() {
      this.loading = true;

      const res = await get_BSignIn_list_page();
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data;
      }
    },
  },
};
</script>
