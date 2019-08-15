<template>
  <div class="draw-setting">
    <h3>风控审核</h3>
    <br />
    <Form ref="form" :model="form" label-position="top">
      <Tabs>
        <TabPane label="订单信息" icon="md-paper">
          <Card>
            <h6>订单信息</h6>
            <Row class="borderbto">
              <Row>
                <Col span="5" class="textr">提款类型：</Col>
                <Col span="6" v-if="form.withdrawType === 1">余额</Col>
                <Col span="6" v-if="form.withdrawType === 2">佣金</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">订单编号：</Col>
                <Col span="6">{{ form.orderNo }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">审核时间：</Col>
                <Col span="6">{{
                  formatBeijingDate(form.auditTime)
                    ? formatBeijingDate(form.auditTime)
                    : formatBeijingDate(new Date())
                }}</Col>
                <Col span="5" style="color:#2d8cf0">
                  <Icon
                    type="ios-clock-outline"
                    style="font-size:16px;"
                  />&nbsp;
                  <span style="font-size:12px;">{{
                    form.withdrawStatus === 1 || form.withdrawStatus === 2
                      ? '审核中...'
                      : '审核完成'
                  }}</span>
                </Col>
              </Row>
            </Row>
            <h6>玩家信息</h6>
            <Row class="borderbto">
              <Row>
                <Col span="5" class="textr">玩家用户名：</Col>
                <Col span="5">{{ form.userName }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">费用-账户：</Col>
                <Col span="5">{{ form.fee }}</Col>
              </Row>
            </Row>
            <h6>提款信息</h6>
            <Row class="borderbto">
              <Row>
                <Col span="5" class="textr">开户行：</Col>
                <Col span="5">{{ form.memberBranchName }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">银行名称：</Col>
                <Col span="5">{{ form.bankName }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">持卡人：</Col>
                <Col span="5">{{ form.memberFullName }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">银行卡号：</Col>
                <Col span="5">{{ form.memberBankCardNo }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">预留手机号：</Col>
                <Col span="5">{{ form.memberPhone }}</Col>
              </Row>
            </Row>
            <h6 v-if="form.auditId">审核信息</h6>
            <Row class="borderbto" v-if="form.auditId">
              <Row>
                <Col span="5" class="textr">审核人：</Col>
                <Col span="5">{{ form.auditName }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">审核时间：</Col>
                <Col span="5">{{ formatBeijingDate(form.auditTime) }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">审核意见：</Col>
                <Col span="5">{{ form.auditOpinion }}</Col>
              </Row>
            </Row>
            <h6 v-if="form.paymentId">财务信息</h6>
            <Row class="borderbto" v-if="form.paymentId">
              <Row>
                <Col span="5" class="textr">支付人：</Col>
                <Col span="5">{{ form.paymentName }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">支付时间：</Col>
                <Col span="5">{{ formatBeijingDate(form.paymentTime) }}</Col>
              </Row>
              <Row>
                <Col span="5" class="textr">支付说明：</Col>
                <Col span="5">{{ form.paymentRemark }}</Col>
              </Row>
            </Row>
          </Card>
          <br />
          <Card>
            <h6>提现金额信息:</h6>
            <br />
            <Table :data="ladder" :columns="columns" :loading="loading">
              <template slot="action">
                <strong> - </strong>
              </template>
              <template slot="action1">
                <strong> = </strong>
              </template>
            </Table> </Card
          ><br />
          <Card v-if="form.amount >= 0 && form.withdrawStatus !== 1">
            <h6>出款信息:</h6>
            <br />
            <Table
              :data="outboundAccount"
              :columns="columns1"
              :loading="loading"
            >
              <template slot-scope="{ row }" slot="paymentTime">
                <span>{{ formatBeijingDate(row.paymentTime) }} </span>
              </template>
            </Table>
          </Card>
        </TabPane>
        <TabPane label="投注检测" icon="ios-list-box-outline"
          >标签二的内容</TabPane
        >
        <TabPane label="帐变检测" icon="logo-tux">标签三的内容</TabPane> </Tabs
      ><br />
      <FormItem label="审核意见：" v-if="form.withdrawStatus === 1">
        <Input
          v-model="form.auditOpinion"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请填写审核意见"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
  name: 'draw-setting-editform',
  props: {
    form: Object,
  },
  data() {
    return {
      btnLoading: false,
      loading: false,
      columns: [
        {
          title: '提款金额',
          key: 'total',
          align: 'center',
        },
        {
          title: ' ',
          slot: 'action',
          width: 150,
          align: 'center',
        },
        {
          title: '行政费',
          key: 'expensesFee',
          align: 'center',
        },
        {
          title: ' ',
          slot: 'action',
          width: 150,
          align: 'center',
        },
        {
          title: '手续费',
          key: 'serviceFee',
          align: 'center',
        },
        {
          title: ' ',
          slot: 'action1',
          width: 150,
          align: 'center',
        },
        {
          title: '到账金额',
          key: 'amount',
          align: 'center',
        },
      ],
      columns1: [
        {
          title: '出款渠道',
          key: 'outboundAccountName',
          align: 'center',
        },
        {
          title: '姓名',
          key: 'outbountAccountFullName',
          align: 'center',
        },
        {
          title: '账户',
          key: 'outboundAccountNo',
          align: 'center',
        },
        {
          title: '出款时间',
          slot: 'paymentTime',
          align: 'center',
        },
      ],
      ladder: [],
      outboundAccount: [],
    };
  },
  methods: {
    inint() {
      let datas = this.form;
      this.ladder.push(datas);
    },
  },
  mounted() {
    this.inint();
  },
};
</script>

<style lang="less" scoped>
.draw-setting {
  margin-left: 30px;
  margin-right: 30px;
  background: #fff;
  padding: 30px;
}
.borderbto {
  border-bottom: 1px solid #efefef;
  margin-bottom: 10px;
  padding: 10px;
  .textr {
    text-align: right;
    padding-right: 20px;
  }
}
</style>
