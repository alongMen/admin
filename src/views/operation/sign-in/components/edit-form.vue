<template>
  <div class="draw-setting">
    <Form ref="form" :rules="rules" :model="form" :label-width="150">
      <Row>
        <Col span="12">
          <FormItem label="名称：" prop="name">
            <Input v-model="form.name"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="星期" prop="signWeek">
            <Select v-model="form.signWeek">
              <Option label="周一" :value="1"> </Option>
              <Option label="周二" :value="2"> </Option>
              <Option label="周三" :value="3"> </Option>
              <Option label="周四" :value="4"> </Option>
              <Option label="周五" :value="5"> </Option>
              <Option label="周六" :value="6"> </Option>
              <Option label="周日" :value="7"> </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="红包：">
            <Input-number
              :min="0"
              v-model="form.amount"
              :max="9999999"
            ></Input-number>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="积分：">
            <Input-number
              :min="0"
              v-model="form.integration"
              :max="9999999"
            ></Input-number>
          </FormItem>
        </Col>
      </Row>
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
        signWeek: [
          {
            required: true,
            type: 'number',
            message: '请选择星期',
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    async validate() {
      return await this.$refs.form.validate()
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
