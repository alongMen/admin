<template>
  <div>
    <Alert type="warning">收款必填文字信息添加后不可修改，请认真填写</Alert>
    <Form ref="form" :model="form" :rules="rules" label-position="top">
      <Row :gutter="20">
        <Col :span="12"
          ><FormItem label="提供商" prop="providerName">
            <Select
              v-model="form.providerName"
              type="button"
              :disabled="form.id > 0"
              @on-change="changeProvider"
            >
              <Option
                v-for="(item, index) in providerNames"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem></Col
        >
        <Col :span="12"
          ><FormItem label="支付渠道" prop="paymentChannel">
            <Input
              v-model="form.paymentChannel"
              :disabled="form.id > 0"
            ></Input> </FormItem
        ></Col>
      </Row>
      <Row :gutter="20">
        <Col :span="8">
          <FormItem label="单笔最小收款" prop="singleMin">
            <InputNumber
              v-model="form.singleMin"
              :min="1"
            ></InputNumber> </FormItem
        ></Col>
        <Col :span="8"
          ><FormItem label="单笔最大收款" prop="singleMax">
            <InputNumber
              v-model="form.singleMax"
              :min="1"
            ></InputNumber> </FormItem
        ></Col>
        <Col :span="8"
          ><FormItem label="今日封顶总交易额(0为无上限)" prop="todayTotal">
            <InputNumber
              v-model="form.todayTotal"
              :min="0"
            ></InputNumber> </FormItem
        ></Col>
      </Row>
      <Row :gutter="20">
        <Col :span="8">
          <FormItem label="手续费率" prop="feeRate">
            <InputNumber v-model="form.feeRate" :min="0"></InputNumber>%
          </FormItem></Col
        >
        <Col :span="8"
          ><FormItem label="随机金额" >
            <InputNumber
              v-model="form.randomAmount"
              :min="1"
              :precision="0"
            ></InputNumber
            >元
          </FormItem></Col
        >
      </Row>
      <Row :gutter="20" v-for="(item, index) in secretConfigList" :key="index">
        <Col :span="8">
          <FormItem :label="item.name"> </FormItem>
        </Col>
        <Col :span="8">
          <upload-button
            v-model="item.accessText"
            :accept="'image/*'"
            v-if="item.isImage"
            :disabled="form.id > 0"
          />
          <Input
            v-model="item.accessText"
            :min="0"
            v-else
            :showDelete="!(form.id > 0)"
          ></Input>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { validBankCard } from '@/utils/validate';
import uploadButton from '@/components/upload-button/index';
import { get_receipt_account_secret } from '@/service/index';
export default {
  name: 'charge-setting-bank',
  components: {
    uploadButton,
  },
  props: {
    bank_list: Array,
    qrcode_list: Array,
    secrect_provider: Array,
    providerNames: Array,
    form: Object,
  },
  data() {
    return {
      secretConfigList: [],
      rules: {
        providerName: [
          {
            required: true,
            type: 'number',
            message: '请选择提供商',
            trigger: 'change',
          },
        ],
        accessText: [
          { required: true, message: '必填项', trigger: 'blur' },
          // { validator: validBankCard, trigger: 'blur' },
        ],
        paymentChannel: [
          { required: true, message: '请填写支付渠道', trigger: 'blur' },
        ],
        brandCode: [
          {
            required: true,
            message: '请填写银行支行名称或扫码账号',
            trigger: 'blur',
          },
        ],
        singleMin: [
          {
            required: true,
            type: 'number',
            message: '请填写单笔最小值',
            trigger: 'blur',
          },
        ],
        singleMax: [
          {
            required: true,
            type: 'number',
            message: '请填写单笔最大值',
            trigger: 'blur',
          },
        ],
        todayTotal: [
          {
            required: true,
            type: 'number',
            message: '请填写今日封顶总交易额',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    changeProvider(value) {
      this.secretConfigList = [];
      this.secrect_provider.forEach(v => {
        if (v.providerName === value) {
          console.log(v.name);
          this.secretConfigList.push(v);
        }
      });
      this.$nextTick(() => {});
    },
    validate() {
      return this.$refs.form.validate();
    },
  },
  async mounted() {
    if (this.form.id) {
      const res = await get_receipt_account_secret(this.form.id);
      if (res.status < 400) {
        this.$nextTick(() => {
          this.secretConfigList = res.data;
          this.secretConfigList.forEach(v => {
            v.accessText = v.accessValue;
          });
        });
      }
    }
  },
};
</script>
