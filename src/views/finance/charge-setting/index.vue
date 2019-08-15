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
        <!-- <template slot-scope="{ row }" slot="providerName">
          {{ providerName(row) }}
        </template> -->

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
          <span>{{ `${row.feeRate}%` }} </span>
        </template>

        <template slot-scope="{ row, index }" slot="status">
          <i-switch
            v-model="row.status"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row, index)"
            size="large"
            :loading="btnLoading"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>
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
      <bank
        v-if="showModal"
        :qrcode_list="qrcode_list"
        :bank_list="bank_list"
        :form="form"
        :providerNames="providerNames"
        :secrect_provider="secrect_provider"
        ref="form"
      />
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="showModal = false"
          >取消</Button
        >
        <Button type="primary" @click="ok" :loading="btnLoading">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import moment from 'moment';
import {
  get_receipt_account_list,
  create_receipt_account,
  update_receipt_account,
  state_receipt_account,
  get_receipt_account_secret_provider,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import Bank from './components/bank';
export default {
  name: 'charge-setting',
  mixins: [mixin],
  components: {
    Bank,
  },
  data() {
    return {
      secrect_provider: [],
      moment,
      columns: [
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
        {
          title: '状态',
          slot: 'status',
        },
        {
          title: '操作',
          slot: 'actions',
        },
      ],
      showDraw: false,
      title: '',
      form: {},
    };
  },

  computed: {
    defaultForm() {
      return [
        {
          type: 'select',
          label: '提供商',
          options: this.providerNames,
          field: 'providerName',
        },
        {
          type: 'text',
          label: '支付渠道',
          field: 'paymentChannel',
        },
      ];
    },
    providerNames() {
      return this.$store.state.base.provider_names;
    },
    bank_list() {
      return this.$store.state.base.bank_list;
    },
    qrcode_list() {
      let qrcode_list = this.$store.state.base.qrcode_list;
      return qrcode_list.slice(0, 2);
    },
  },
  methods: {
    providerName(row) {
      let name;
      this.providerNames.forEach(v => {
        if (v.value === row.providerName) {
          name = v.label;
        }
      });
      return name;
    },
    add() {
      this.title = '添加收款账号';
      this.form = {
        singleMin: 1,
        singleMax: 1,
        todayTotal: 0,
        randomAmount: 1,
        feeRate: 0,
      };
      this.showModal = true;
    },
    setting(row) {
      this.title = '配置收款账号';
      this.form = cloneDeep(row);
      this.showDraw = true;
    },
    edit(row) {
      this.title = '编辑收款账号';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    async ok() {
      if (this.form.singleMin > this.form.singleMax) {
        this.$Message.error('单笔下限不能比单笔上限高');
        return;
      }
      const secretConfigList = this.$refs.form.secretConfigList;
      let isReturn = false;
      secretConfigList.forEach(v => {
        if (!v.accessText) {
          this.$Message.error(`${v.name}为必填项`);
          isReturn = true;
        }
      });
      if (isReturn) return;
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.form.secretConfigList = secretConfigList;
      this.form.feeRate = this.toDecimal(this.form.feeRate);
      this.btnLoading = true;
      if (this.form.id) {
        const res = await update_receipt_account(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('更新收款账号成功');
          this.showModal = false;
          this.getData();
        }
      } else {
        const res = await create_receipt_account(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加收款账号成功');
          this.showModal = false;
          this.getData();
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
        content: `<p>是否${title}该收款账号</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await state_receipt_account(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}收款账号成功`);
            this.$Modal.remove();
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
    async getSecrectProvider() {
      this.loading = true;
      const res = await get_receipt_account_secret_provider();
      this.loading = false;
      if (res.status < 400) {
        this.secrect_provider = res.data;
      }
    },
    async getData() {
      this.loading = true;
      const query = {
        providerName: this.query.providerName,
        paymentChannel: this.query.paymentChannel,
      };
      const res = await get_receipt_account_list(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
        this.data.forEach(v => {
          const date = moment().format('YYYY-MM-DD');
          const todayDay = this.formatBeijingDate(v.todayDay).substring(0, 10);
          if (todayDay !== date) {
            v.todayAmont = 0;
          }
          v.feeRate = this.toPercent(v.feeRate);
        });
      }
    },
  },
  async mounted() {
    this.getSecrectProvider();
    if (this.bank_list.length === 0) {
      this.$store.dispatch('get_bank_list');
    }
    if (this.qrcode_list.length === 0) {
      this.$store.dispatch('get_qrcode_list');
    }

    if (this.providerNames.length === 0) {
      this.$store.dispatch('get_provider_names');
    }
  },
};
</script>
