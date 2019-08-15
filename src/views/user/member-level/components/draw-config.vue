<template>
  <div class="main-area">
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading" ref="selection">
        <template slot-scope="{ row, index }" slot="action">
          <Checkbox
            v-model="row.isSelect"
            @on-change="val => selectRow(val, row, index)"
          ></Checkbox>
        </template>
        <template slot-scope="{ row }" slot="isNotFlowToCash">
          <Tag :color="row.isNotFlowToCash ? 'green' : 'red'">{{
            row.isNotFlowToCash ? '是' : '否'
          }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="flowLimit">
          {{ row.flowLimit }}%
        </template>
        <template slot-scope="{ row }" slot="serviceRate">
          {{ row.serviceRate }}%
        </template>
      </Table>
    </div>
    <div class="drawer-footer">
      <Button @click="$emit('close')" style="margin-right: 8px">取消</Button>
      <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_withdraw_rule_list_all,
  set_withdraw_rule_by_level,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import DrawExpandRow from './draw-expand-row.vue';
export default {
  name: 'draw-config',
  components: { DrawExpandRow },
  mixins: [mixin],
  props: {
    form: Object,
  },
  data() {
    return {
      columns: [
        {
          title: '详情',
          type: 'expand',
          width: 60,
          render: (h, params) => {
            return h(DrawExpandRow, {
              props: {
                withdrawalRuleDetails: params.row.withdrawalRuleDetails,
              },
            });
          },
        },
        {
          title: '选择',
          slot: 'action',
          width: 60,
          align: 'center',
        },
        {
          title: '单笔最小出款',
          key: 'singleMin',
        },
        {
          title: '单笔最大出款',
          key: 'singleMax',
        },
        {
          title: '今日出款次数',
          key: 'todayTimes',
        },
        {
          title: '流水限制',
          key: 'flowLimit',
          slot: 'flowLimit',
        },
        {
          title: '未达流水可否提现',
          key: 'isNotFlowToCash',
          slot: 'isNotFlowToCash',
        },
        {
          title: '行政费率',
          key: 'serviceRate',
          slot: 'serviceRate',
        },
        {
          title: '行政费封顶',
          key: 'serviceMaxFee',
        },
        {
          title: '免手续费率次数',
          key: 'freeFeeTimes',
        },
      ],
      withdrawalRuleId: 0,
    };
  },
  computed: {
    defaultForm() {
      return [];
    },
  },
  methods: {
    selectRow(val, row, i) {
      this.data[i].isSelect = val;
      row.isSelect = val;
      if (row.isSelect) {
        this.withdrawalRuleId = row.id;
        this.data.forEach((v, index) => {
          if (i !== index) {
            v.isSelect = false;
          }
        });
      } else {
        this.withdrawalRuleId = 0;
      }
      this.data.splice(i, 1, row);
    },
    async ok() {
      if (!this.withdrawalRuleId) {
        this.$Message.error('请选择一个提现规则');
        return;
      }

      const res = await set_withdraw_rule_by_level(
        this.form.id,
        this.withdrawalRuleId,
      );
      if (res.status < 400) {
        this.$Message.success('设置成功');
        this.$emit('close');
        this.$emit('getFatherData');
      }
    },
    async getData() {
      this.loading = true;
      const query = {};
      const res = await get_withdraw_rule_list_all(query);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data;
        this.data.forEach((v, index) => {
          v.serviceRate = this.toPercent(v.serviceRate);
          v.flowLimit = this.toPercent(v.flowLimit);
          v.withdrawalRuleDetails.forEach(v => {
            v.serviceRate = this.toPercent(v.serviceRate);
          });
          v._expanded = true;
          if (this.form.withdrawalRuleId === v.id) {
            v.isSelect = true;
          } else {
            v.isSelect = false;
          }
        });
      }
    },
  },
};
</script>
