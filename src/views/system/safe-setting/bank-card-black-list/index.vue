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
      <Table :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="bankCardType">
          <span>{{ row.bankCardType === 1 ? '借记卡' : '信用卡' }} </span>
        </template>
        <template slot-scope="{ row }" slot="modifyTime">
          <span>{{ formatBeijingDate(row.modifyTime) }}</span>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="error" @click="del(row)">删除</Button>
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
      <Form ref="form" :model="form" :rules="rules" label-position="top">
        <FormItem label="持卡人" prop="fullName">
          <Input v-model="form.fullName"></Input>
        </FormItem>
        <FormItem label="银行卡类型">
          <Select v-model="form.bankCardType">
            <Option :value="1">借记卡</Option>
            <Option :value="2">信用卡</Option>
          </Select>
        </FormItem>
        <FormItem label="银行卡号" prop="bankCardNo">
          <Input v-model="form.bankCardNo"></Input>
        </FormItem>
        <FormItem label="开户行" prop="branchName">
          <Input v-model="form.branchName"></Input>
        </FormItem>
        <FormItem label="银行名称" prop="bankNameId">
          <Select v-model="form.bankNameId">
            <Option v-for="item in bank_list" :value="item.id" :key="item.id">{{
              item.name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预留手机号" prop="phone">
          <Input v-model="form.phone"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="form.remark"></Input>
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
import {
  get_bankcard_black_list,
  create_bankcard_black,
  delete_bankcard_black,
} from '@/service/index';
import { validBankCard, validMobile } from '@/utils/validate';
export default {
  name: 'bank-card-black-list',
  mixins: [mixin],

  data() {
    return {
      columns: [
        {
          title: '持卡人',
          key: 'fullName',
        },
        {
          title: '银行卡号',
          key: 'bankCardNo',
        },
        {
          title: '银行卡类型',
          key: 'bankCardType',
          slot: 'bankCardType',
        },
        {
          title: '开户行',
          key: 'branchName',
        },
        {
          title: '银行名称',
          key: 'bankName',
        },
        // {
        //   title: '预留手机号',
        //   key: 'phone',
        // },
        {
          title: '备注',
          key: 'remark',
        },
        // {
        //   title: '插入时间',
        //   key: 'modifyTime',
        //   slot: 'modifyTime',
        // },
        {
          title: '操作',
          slot: 'actions',
        },
      ],
      rules: {
        fullName: [
          { required: true, message: '请填写持卡人', trigger: 'blur' },
        ],
        bankCardNo: [
          { required: true, message: '请填写卡号', trigger: 'blur' },
          { validator: validBankCard, trigger: 'blur' },
        ],
        branchName: [
          { required: true, message: '请填写开户行', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请填写手机', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' },
        ],
        bankNameId: [
          {
            required: true,
            type: 'number',
            message: '请选择银行',
            trigger: 'change',
          },
        ],
      },
      title: '添加银行卡黑名单',
      form: {},
    };
  },

  computed: {
    defaultForm() {
      return [];
    },
    bank_list() {
      return this.$store.state.base.bank_list;
    },
  },
  methods: {
    add() {
      this.form = {};
      this.showModal = true;
    },

    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.btnLoading = true;
      const res = await create_bankcard_black(this.form);
      this.btnLoading = false;
      if (res.status < 400) {
        this.$Message.success('添加黑名单成功');
        this.showModal = false;
        this.getData();
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除',
        loading: true,
        content: '<p>是否删除该银行卡黑名单</p>',
        onOk: async () => {
          const res = await delete_bankcard_black(row.id);
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
      const res = await get_bankcard_black_list(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
  mounted() {
    if (this.bank_list.length === 0) {
      this.$store.dispatch('get_bank_list');
    }
  },
};
</script>
