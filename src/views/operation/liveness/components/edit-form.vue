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
          <FormItem label="活跃度值：( 1～100 )">
            <Input-number
              :min="1"
              v-model="form.fullAmount"
              :max="100"
            ></Input-number>
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
import { cloneDeep } from 'lodash';
import { game_type, registerCondition, game_platform } from '@/config/enum';
import {
  add_activity_detail_page,
  del_activity_detail_page,
  edit_activity_detail_page,
  get_activity_detail_page,
} from '@/service/index';
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
      },
    };
  },
  methods: {},
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
