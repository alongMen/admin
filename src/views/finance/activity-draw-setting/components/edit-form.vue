<template>
  <div class="draw-setting">
    <Form ref="form" :rules="rules" :model="form" label-position="top">
      <FormItem label="名称：" prop="name">
        <Input v-model="form.name"></Input>
      </FormItem>

      <FormItem label="活动类型（一个类型只能配置一条）：">
        <Select v-model="form.marketingType" :disabled="form.id ? true : false">
          <Option label="活动" :value="1"> </Option>
          <Option label="任务" :value="2"> </Option>
          <Option label="活跃度" :value="3"> </Option>
        </Select>
      </FormItem>

      <FormItem label="提现流水倍数：">
        <Input-number :min="0" v-model="form.withdrawalFlowRate"></Input-number
        >%
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'draw-setting-editform',
  props: {
    form: Object,
  },
  data() {
    return {
      btnLoading: false,
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        marketingType: [
          {
            required: true,
            type: 'number',
            message: '请选择类型',
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    async validate() {
      return await this.$refs.form.validate();
    },
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
</style>
