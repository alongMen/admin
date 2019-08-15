<template>
  <div class="member-pay-form">
    <template>
      <p class="pay-title">离线收款账号</p>
      <div class="table-area">
        <Table
          :columns="columns"
          :data="data"
          ref="selection"
          @on-selection-change="selectRow"
          :loading="loading"
        >
          <template slot-scope="{ row }" slot="singleMin">
            {{ parsePrice(row.singleMin) }}
          </template>
          <template slot-scope="{ row }" slot="singleMax">
            {{ parsePrice(row.singleMax) }}
          </template>
          <template slot-scope="{ row }" slot="todayTotal">
            {{ parsePrice(row.todayTotal) }}
          </template>
          <template slot-scope="{ row }" slot="todayAmont">
            {{ parsePrice(row.todayAmont) }}
          </template>
          <template slot-scope="{ row }" slot="totalAmount">
            {{ parsePrice(row.totalAmount) }}
          </template>
          <template slot-scope="{ row }" slot="feeRate">
            <span>{{ `${row.feeRate}` }} </span>
          </template>
        </Table>
      </div>
    </template>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="$emit('close')">取消</Button>
      <Button type="primary" :loading="btnLoading" @click="ok()">确定</Button>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import moment from 'moment';
import {
  get_receipt_account_all,
  get_receipt_account_by_grade_id,
  set_receipt_account_by_grade_id,
} from '@/service/index';
export default {
  name: 'charge-config',
  mixins: [mixin],
  props: {
    form: Object,
  },
  data() {
    return {
      columns: [
        {
          type: 'selection',
          align: 'center',
        },
        {
          title: '提供商',
          key: 'providerDisplay',
        },
        {
          title: '支付渠道',
          key: 'paymentChannel',
        },
        {
          title: '单笔最小收款',
          slot: 'singleMin',
        },
        {
          title: '单笔最大收款',
          slot: 'singleMax',
        },
        {
          title: '今日封顶总交易额',
          slot: 'todayTotal',
        },
        {
          title: '手续费率',
          slot: 'feeRate',
        },
        {
          title: '今日已交易金额',
          slot: 'todayAmont',
        },
        {
          title: '总交易额',
          slot: 'totalAmount',
        },
      ],
      selected: [],
    };
  },

  computed: {
    bank_list() {
      return this.$store.state.base.bank_list;
    },
    qrcode_list() {
      return this.$store.state.base.qrcode_list;
    },
  },
  methods: {
    accountTypeName(row) {
      let name;
      if (row.accountMode === 1) {
        this.bank_list.forEach(v => {
          if (v.id === row.accountId) {
            name = v.name;
          }
        });
      } else {
        this.qrcode_list.forEach(v => {
          if (v.id === row.accountId) {
            name = v.name;
          }
        });
      }
      return name;
    },
    selectRow(selection) {
      this.selected = selection;
    },
    async ok() {
      if (this.selected.length === 0) {
        this.$Message.error('请选择至少一个收款账号');
        return;
      }
      const receiptAccountIds = [];
      this.selected.forEach(v => {
        receiptAccountIds.push(v.id);
      });
      const param = {
        gradeId: this.form.id,
        receiptAccountIds: receiptAccountIds,
      };
      const res = await set_receipt_account_by_grade_id(param);
      if (res.status < 400) {
        this.$Message.success('添加成功');
        this.$emit('close');
      }
    },
    async getData() {
      this.loading = true;
      const query = {};
      const res = await get_receipt_account_all(query);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data;
        const date = moment().format('YYYY-MM-DD');
        this.data.forEach(v => {
          const todayDay = this.formatBeijingDate(v.todayDay).substring(0, 10);
          if (todayDay !== date) {
            v.todayAmont = 0;
          }
          v.feeRate = this.toPercent(v.feeRate) + '%';
        });
      }
      const res1 = await get_receipt_account_by_grade_id(this.form.id);
      if (res1.status < 400) {
        res1.data.forEach(v => {
          this.data.forEach((value, index) => {
            if (value.id === v) {
              this.$refs.selection.$refs.tbody.objData[index]._isChecked = true;
              this.selected.push(value);
            }
          });
        });
      }
    },
  },
  mounted() {
    if (this.bank_list.length === 0) {
      this.$store.dispatch('get_bank_list');
    }
    if (this.qrcode_list.length === 0) {
      this.$store.dispatch('get_qrcode_list');
    }
  },
};
</script>
<style lang="less">
.member-pay-form {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 20px;
  .ivu-form-item {
    margin-bottom: 0;
  }
  .pay-title {
    font-size: 16px;
    text-align: left;
  }
}
</style>
