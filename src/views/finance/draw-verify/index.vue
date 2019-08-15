<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />

    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="withdrawType">
          <Tag color="cyan" v-if="row.withdrawType === 1">余额</Tag>
          <Tag color="magenta" v-if="row.withdrawType === 2">佣金</Tag>
        </template>
        <template slot-scope="{ row }" slot="withdrawStatus">
          <Tag color="orange" v-if="row.withdrawStatus === 1">发起审核</Tag>
          <Tag color="green" v-if="row.withdrawStatus === 2">风控通过</Tag>
          <Tag color="purple" v-if="row.withdrawStatus === 3">提现成功</Tag>
          <Tag color="red" v-if="row.withdrawStatus === 4">审核失败</Tag>
        </template>

        <template slot-scope="{ row }" slot="total">
          {{ parsePrice(row.total) }}
        </template>
        <template slot-scope="{ row }" slot="amount">
          {{ parsePrice(row.amount) }}
        </template>

        <template slot-scope="{ row }" slot="createTime">
          {{ formatBeijingDate(row.createTime) }}
        </template>

        <template slot-scope="{ row }" slot="actions">
          <Button
            type="info"
            @click="lookinfo(row)"
            v-if="row.withdrawStatus !== 1 && row.withdrawStatus !== 2"
            >查看详情</Button
          >
          <Button
            type="primary"
            @click="verify(row)"
            v-if="row.withdrawStatus === 1"
            >风控审核</Button
          >
          <Button
            type="success"
            @click="verify1(row)"
            v-if="row.withdrawStatus === 2"
            >财务审核</Button
          >&nbsp;&nbsp;
          <Button
            type="error"
            @click="refuse(row)"
            v-if="row.withdrawStatus === 1 || row.withdrawStatus === 2"
            >拒绝</Button
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

      <Drawer :title="title" v-model="showModal" width="70">
        <draw-form :form="form" v-if="showModal" ref="form" />
        <div class="drawer-footer" v-if="form.withdrawStatus === 1">
          <Button @click="refuse(form)" type="error" style="margin-right: 8px"
            >拒绝</Button
          >
          <Button type="primary" :loading="btnLoading" @click="firstOK(form)"
            >通过</Button
          >
        </div>
        <div class="drawer-footer" v-if="form.withdrawStatus === 2">
          <Button @click="refuse(form)" type="error" style="margin-right: 8px"
            >拒绝</Button
          >
          <Button type="primary" :loading="btnLoading" @click="secondOK(form)"
            >通过</Button
          >
        </div>
      </Drawer>
    </div>

    <Modal v-model="showModalForm" :mask-closable="false">
      <div class="opt-title">选择出款渠道</div>
      <Form ref="form" :model="form" label-position="top">
        <FormItem label="渠道">
          <Select v-model="outAccountId">
            <Option
              v-for="(item, index) in ways"
              :key="index"
              :value="item.outAccountId"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="remark" placeholder="输入备注" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="showModalForm = false"
          >取消</Button
        >
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  get_draw_verify_list,
  get_outbound_account_all,
  patch_withdraw_audit_verify,
  patch_withdraw_finance_verify,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import mixin from '@/mixins/single-form-mixin';
import DrawForm from './components/draw-form';
export default {
  mixins: [mixin],
  components: {
    DrawForm,
  },
  name: 'draw-verify',
  data() {
    return {
      outAccountId: 0,
      ways: [],
      remark: '',
      showModalForm: false,
      columns: [
        {
          title: '订单号',
          key: 'orderNo',
        },
        {
          title: '用户名',
          key: 'userName',
        },
        {
          title: '提现类型',
          slot: 'withdrawType',
        },
        {
          title: '提现金额',
          slot: 'total',
        },
        {
          title: '到账金额',
          slot: 'amount',
        },
        {
          title: '状态',
          slot: 'withdrawStatus',
        },
        {
          title: '申请时间',
          slot: 'createTime',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 250,
        },
      ],
      title: '',
      form: {},
    };
  },

  computed: {
    moreForm() {
      return [
        {
          type: 'radioButton',
          label: '提现类型',
          options: [{ label: '余额', value: 1 }, { label: '佣金', value: 2 }],
          field: 'withdrawType',
        },
        {
          label: '时间',
          field: 'time',
          type: 'timeRange',
        },
      ];
    },
    defaultForm() {
      return [
        {
          type: 'text',
          label: '持卡人',
          field: 'memberFullName',
        },
        {
          type: 'text',
          label: '订单号',
          field: 'OrderNo',
        },
        {
          type: 'radioButton',
          label: '提现状态',
          options: [
            { label: '发起审核', value: 1 },
            { label: '风控通过', value: 2 },
            { label: '财务审核', value: 3 },
            { label: '审核失败', value: 4 },
          ],
          field: 'WithdrawStatus',
        },
      ];
    },
  },

  methods: {
    async getData() {
      let begTime, endTime;
      this.loading = true;
      if (this.query.time) {
        begTime = this.query.time[0];
        endTime = this.query.time[1];
      }
      const query = {
        FullName: this.query.FullName,
        OrderNo: this.query.OrderNo,
        WithdrawStatus: this.query.WithdrawStatus,
        begTime,
        endTime,
      };
      const res = await get_draw_verify_list(this.page, this.limit, query);
      this.loading = false;

      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
    lookinfo(row) {
      this.showModal = true;
      this.form = cloneDeep(row);
    },
    //风控审核
    verify(row) {
      this.showModal = true;
      this.form = cloneDeep(row);
    },
    async firstOK(form) {
      this.btnLoading = true;
      if (this.form.withdrawStatus === 1) {
        this.remark = form.auditOpinion;
        this.form.state = 1;
      }
      const res = await patch_withdraw_audit_verify(
        this.form.id,
        this.form.state,
        this.remark,
      );
      this.btnLoading = false;
      if (res.status === 200) {
        setTimeout(() => {
          this.$Message.success('风控审核完成');
        }, 500);
        this.showModal = false;
        this.getData();
      }
    },
    //拒绝
    async refuse(form) {
      this.showModal = false;
      this.btnLoading = true;
      this.remark = '拒绝';
      this.form.state = 2;
      let res;
      if (form.withdrawStatus == 1) {
        res = await patch_withdraw_audit_verify(
          form.id,
          this.form.state,
          this.remark,
        );
      } else if (form.withdrawStatus == 2) {
        res = await patch_withdraw_finance_verify(
          form.id,
          this.form.state,
          this.remark,
          this.outAccountId,
        );
      }
      this.btnLoading = false;
      if (res.status === 200) {
        this.$Message.success('已拒绝！');
        this.showModal = false;
        this.getData();
        this.showModalForm = false;
        this.way = '';
      }
    },
    //财务审核
    async verify1(row) {
      this.showModal = true;
      this.form = cloneDeep(row);
      if (this.form.id) {
        const res = await get_outbound_account_all(this.form.id);
        if (res.status < 400) {
          this.ways = res.data.map(item => {
            return {
              label: item.name + '--' + item.accountNo + '--' + item.fullName,
              label: item.name + '--' + item.accountNo + '--' + item.fullName,
              outAccountId: item.id,
            };
          });
        }
      }
      this.showModalForm = true;
    },
    ok() {
      // console.log(this.form.id,this.outAccountId)
      this.showModalForm = false;
    },
    async secondOK() {
      this.btnLoading = true;
      if (this.form.withdrawStatus === 2) {
        this.form.state = 1;
      }
      const res = await patch_withdraw_finance_verify(
        this.form.id,
        this.form.state,
        this.remark,
        this.outAccountId,
      );
      this.btnLoading = false;
      if (res.status < 400) {
        setTimeout(() => {
          this.$Message.success('财务审核完成');
        }, 500);
        this.showModal = false;
        this.showModalForm = false;
        this.way = '';
        this.page = 1;
        this.getData();
      }
    },
  },
};
</script>
<style lang="less">
.opt-title {
  width: 100%;
  text-align: center;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  padding-bottom: 50px;
}
</style>
