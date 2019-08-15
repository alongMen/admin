<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="[]"
      v-model="query"
    />
    <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div>
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="singleMin">
          {{ parsePrice(row.singleMin) }}
        </template>
        <template slot-scope="{ row }" slot="singleMax">
          {{ parsePrice(row.singleMax) }}
        </template>
        <template slot-scope="{ row }" slot="serviceMaxFee">
          {{ parsePrice(row.serviceMaxFee) }}
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }} </span>
        </template>
        <template slot-scope="{ row }" slot="isNotFlowToCash">
          <Tag :color="row.isNotFlowToCash ? 'green' : 'red'">{{
            row.isNotFlowToCash ? '是' : '否'
          }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="isRechargeFlowZero">
          <Tag :color="row.isRechargeFlowZero ? 'green' : 'red'">{{
            row.isRechargeFlowZero ? '是' : '否'
          }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="flowLimit">
          {{ row.flowLimit }}%
        </template>
        <template slot-scope="{ row }" slot="serviceRate">
          {{ row.serviceRate }}%
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
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>&nbsp;
          <Button type="error" v-if="!row.isEdit" @click="del(row)"
            >删除</Button
          >
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
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_withdraw_rule_list_page,
  create_withdraw_rule,
  update_withdraw_rule,
  state_withdraw_rule,
  delete_withdraw_rule,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import EditForm from './components/edit-form';
export default {
  name: 'charge-setting',
  mixins: [mixin],
  components: {
    EditForm,
  },
  data() {
    return {
      columns: [
        {
          title: '单笔最小出款',
          slot: 'singleMin',
        },
        {
          title: '单笔最大出款',
          slot: 'singleMax',
        },
        {
          title: '今日出款次数',
          key: 'todayTimes',
        },
        {
          title: '流水限制',
          slot: 'flowLimit',
        },
        {
          title: '未达流水可否提现',
          slot: 'isNotFlowToCash',
        },
        {
          title: '充值流水是否清零',
          slot: 'isRechargeFlowZero',
        },
        {
          title: '行政费率',
          slot: 'serviceRate',
        },
        {
          title: '行政费封顶',
          slot: 'serviceMaxFee',
        },
        {
          title: '免手续费率次数',
          key: 'freeFeeTimes',
        },

        {
          title: '状态',
          key: 'status',
          slot: 'status',
        },
        {
          title: '创建时间',
          key: 'createTime',
          slot: 'createTime',
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
      return [];
    },
  },
  methods: {
    add() {
      this.title = '添加提现规则';
      this.form = {
        singleMin: 1,
        singleMax: 1,
        todayTimes: 1,
        flowLimit: 0,
        isNotFlowToCash: false,
        serviceRate: 0,
        serviceMaxFee: 0,
        freeFeeTimes: 0,
      };
      this.showModal = true;
    },
    edit(row) {
      this.title = '编辑提现规则';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    async ok() {
      if (this.form.singleMin > this.form.singleMax) {
        this.$Message.error('单笔下限不能比单笔上限高');
        return;
      }
      const some = this.$refs.form.ladder.some(v => v.isEdit);
      if (some) {
        return this.$Message.error('请先完成编辑');
      }
      this.form.serviceRate = this.toDecimal(this.form.serviceRate);
      this.form.flowLimit = this.toDecimal(this.form.flowLimit);
      this.btnLoading = true;
      if (this.form.id) {
        const res = await update_withdraw_rule(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('更新提现规则成功');
          this.showModal = false;
          this.getData();
        }
      } else {
        this.form.withdrawalRuleDetails = this.$refs.form.ladder;
        this.form.withdrawalRuleDetails.forEach(v => {
          v.serviceRate = this.toDecimal(v.serviceRate);
        });
        const res = await create_withdraw_rule(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加提现规则成功');
          this.showModal = false;
          this.getData();
        }
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除',
        loading: true,
        content: '<p>是否删除该条提款规则</p>',
        onOk: async () => {
          const res = await delete_withdraw_rule(row.id);
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
        content: `<p>是否${title}该提现规则</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await state_withdraw_rule(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}提现规则成功`);
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
      const query = {};
      const res = await get_withdraw_rule_list_page(
        this.page,
        this.limit,
        query,
      );
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
        this.data.forEach(v => {
          v.serviceRate = this.toPercent(v.serviceRate);
          v.flowLimit = this.toPercent(v.flowLimit);
        });
      }
    },
  },
};
</script>
