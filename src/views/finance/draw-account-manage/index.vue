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
        <template slot-scope="{ row }" slot="totalAmount">
          {{ parsePrice(row.totalAmount) }}
        </template>

        <template slot-scope="{ row, index }" slot="status">
          <i-switch
            v-model="row.status"
            size="large"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row, index)"
            :loading="btnLoading"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
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
    <Modal :title="title" v-model="showModal" :mask-closable="false">
      <Alert type="warning">出款账号填写后无法更改，请认真填写</Alert>
      <Form ref="form" :model="form" :rules="rules" label-position="top">
        <FormItem label="名称 (例：银行名称/微信/支付宝)" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem
          label="账号 (例：银行卡号/微信号/支付宝号等)"
          prop="accountNo"
        >
          <Input v-model="form.accountNo"></Input>
        </FormItem>
        <FormItem
          label="账户名 (例：银行卡所有人/微信/支付宝所有人等)"
          prop="fullName"
        >
          <Input v-model="form.fullName"></Input>
        </FormItem>
        <FormItem label="权重 (值越大,优先级越高)">
          <InputNumber v-model="form.sortCode" :min="0"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import { state } from '@/config/enum';
import {
  get_outbound_account_page,
  set_state_outbound_account,
  create_outbound_account,
  update_outbound_account,
} from '@/service/index';
export default {
  name: 'draw-account-manage',
  mixins: [mixin],

  data() {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
        },
        {
          title: '账号',
          key: 'accountNo',
        },
        {
          title: '账户名',
          key: 'fullName',
        },
        {
          title: '实际总出款额',
          slot: 'totalAmount',
        },
        {
          title: '权重(值越大,优先级越高)',
          key: 'sortCode',
        },
        {
          title: '创建时间',
          slot: 'createTime',
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
        },
      ],
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        accountNo: [{ required: true, message: '请填写账号', trigger: 'blur' }],
        fullName: [
          { required: true, message: '请填写账户名', trigger: 'blur' },
        ],
      },
      title: '添加出款账号',
      form: {},
    };
  },

  computed: {
    defaultForm() {
      return [
        {
          type: 'text',
          label: '账户名',
          field: 'name',
        },
        {
          type: 'radioButton',
          label: '状态',
          options: state,
          field: 'status',
        },
        {
          label: '时间',
          field: 'date',
          type: 'timeRange',
        },
      ];
    },
  },
  methods: {
    add() {
      this.form = { sortCode: 0 };
      this.showModal = true;
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
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该出款账号</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_state_outbound_account(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}出款账号成功`);
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
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.btnLoading = true;
      const res = await create_outbound_account(this.form);
      this.btnLoading = false;
      if (res.status < 400) {
        this.$Message.success('添加出款账号成功');
        this.showModal = false;
        this.getData();
      }
    },

    async getData() {
      const query = {
        name: this.query.name,
        status: this.query.status,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      };
      this.loading = true;
      const res = await get_outbound_account_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
};
</script>
