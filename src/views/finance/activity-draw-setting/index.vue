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
        <template slot-scope="{ row }" slot="withdrawalFlowRate">
          {{row.withdrawalFlowRate}}%
        </template>
        <template slot-scope="{ row }" slot="marketingType">
            <span v-if='row.marketingType===1'>活动</span>
            <span v-if='row.marketingType===2'>任务</span>
            <span v-if='row.marketingType===3'>活跃度</span>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>&nbsp;
          <Button type="error" v-if="!row.isEdit" @click="del(row)"
            >删除</Button
          >
        </template>
      </Table>
      <!-- <div class="pagination">
        <Page
          :total="total"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
          show-total
        />
      </div> -->
    </div>
    <Modal :title="title" v-model="showModal" >
      <edit-form :form="form" v-if="showModal" ref="form" />
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="oks">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_activity_draw_settings,
  add_activity_draw_setting,
  edit_activity_draw_setting,
  del_activity_draw_setting,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import EditForm from './components/edit-form';
export default {
  name: 'activity-draw-setting',
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
          title: '活动类型',
          slot: 'marketingType',
        },
        {
          title: '活动名称',
          key: 'marketingTypeName',
        },
        {
          title: '提现流水',
          slot: 'withdrawalFlowRate',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 240,
        },
      ],
      title: '',
      form: {},
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          label: '名称',
          type: 'text',
          field: 'name',
        },
        {
          label: '时间',
          field: 'date',
          type: 'timeRange',
        },
      ];
    },
    moreForm() {
      return [];
    },
  },
  methods: {
    add() {
      this.title = '添加活动提现规则';
      this.showModal = true;
      this.form = {
        fullAmount: 5,
        amount: 0,
        integration: 0,
      };
    },
    edit(row) {
      this.title = '编辑活动提现规则';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    async oks() {
      // console.log(this.form);
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.btnLoading = true;
      this.form.withdrawalFlowRate = this.toDecimal(this.form.withdrawalFlowRate)
      if (this.form.id) {
        const res = await edit_activity_draw_setting(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('更新活动提现规则成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.success(res);
        }
      } else {
        const res = await add_activity_draw_setting(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加活动提现规则成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.success(res);
        }
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除',
        loading: true,
        content: '<p>是否删除该活动提现规则</p>',
        onOk: async () => {
          const res = await del_activity_draw_setting(row.id);
          if (res.status < 400) {
            this.$Message.success('删除成功');
            this.$Modal.remove();
            this.getData();
          } else {
            this.$Modal.remove();
          }
        },
      });
    },
    async getData() {
      this.loading = true;
      const query = {};
      const res = await get_activity_draw_settings(query);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data;
        this.data.forEach(v=>{
          v.withdrawalFlowRate = this.toPercent(v.withdrawalFlowRate)
        })
      }
    },
  },
};
</script>
