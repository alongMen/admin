<template>
  <div class="draw-setting">
    <Form ref="form" :rules="rules" :model="form" :label-width="100">
      <Row>
        <Col span="12">
          <FormItem label="活动标题：" prop="title">
            <Input v-model="form.title"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="活动类型：">
            <RadioGroup v-model="form.activityType" @on-change="init">
              <Radio :label="1" :disabled="form.id || hasSaved">注册</Radio>
              <Radio :label="2" :disabled="form.id || hasSaved">充值</Radio>
              <Radio :label="3" :disabled="form.id || hasSaved">推广</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <FormItem label="列表图片：" prop="imageUrl">
            <upload-button v-model="form.imageUrl" :accept="'image/*'" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="内容图片：" prop="detailImageUrl">
            <upload-button v-model="form.detailImageUrl" :accept="'image/*'" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="活动开始时间：">
            <DatePicker
              type="datetime"
              placeholder="请选择日期时间"
              style="width: 280px;margin-top:20px;"
              v-model="form.startTime"
              size="small"
              format="yyyy-MM-dd HH:mm"
            >
            </DatePicker>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="活动结束时间：">
            <DatePicker
              type="datetime"
              placeholder="请选择日期时间"
              style="width: 280px;margin-top:20px;"
              v-model="form.endTime"
              size="small"
              format="yyyy-MM-dd HH:mm"
            >
            </DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="领取开始时间：">
            <DatePicker
              type="datetime"
              placeholder="请选择日期时间"
              style="width: 280px;margin-top:20px;"
              v-model="form.drawStartTime"
              size="small"
              format="yyyy-MM-dd HH:mm"
            >
            </DatePicker>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="领取结束时间：">
            <DatePicker
              type="datetime"
              placeholder="请选择日期时间"
              style="width: 280px;margin-top:20px;"
              v-model="form.drawEndTime"
              size="small"
              format="yyyy-MM-dd HH:mm"
            >
            </DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8" style="margin-top:20px;">
          <FormItem label="状态：">
            <i-switch
              v-model="form.status"
              :true-value="1"
              :false-value="2"
              size="large"
              :loading="btnLoading"
            >
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <h5>
      活动详情:<span
        style="padding-left:10px;font-weight:400;font-size:8px;"
        v-if="!form.id"
        >( 请选择活动类型后方可添加详情! )</span
      >
    </h5>
    <br />
    <div>
      <Button type="primary" @click="addLadder">添加</Button>
    </div>
    <br />
    <Table :data="ladder" :columns="columns" :loading="loading">
      <template
        slot-scope="{ row }"
        slot="registerCondition"
        v-if="form.activityType == 1"
      >
        <Select v-model="row.registerCondition" v-if="row.isEdit">
          <Option
            :value="item.value"
            v-for="(item, index) in registerConditions"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
        <div v-else>
          <span
            v-for="(items, index) in registerConditions"
            :key="index"
            v-if="row.registerCondition == items.value"
            >{{ items.label }}</span
          >
        </div>
      </template>

      <template
        slot-scope="{ row }"
        slot="fullAmount"
        v-if="form.activityType == 2"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.fullAmount"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.fullAmount }}</span>
      </template>

      <template
        slot-scope="{ row }"
        slot="isFirstCharge"
        v-if="form.activityType == 2"
      >
        <i-switch v-model="form.isFirstCharge" size="large" v-if="row.isEdit">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
        <span v-else-if="row.isFirstCharge == true">是</span>
        <span v-else-if="row.isFirstCharge == false">否</span>
      </template>

      <template
        slot-scope="{ row }"
        slot="platformType"
        v-if="form.activityType == 3"
      >
        <Select v-model="row.platformType" v-if="row.isEdit">
          <Option
            :value="item.value"
            v-for="(item, index) in game_platform"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
        <div v-else>
          <span
            v-for="(items, index) in game_platform"
            :key="index"
            v-if="row.platformType === items.value"
            >{{ items.label }}</span
          >
        </div>
      </template>

      <template
        slot-scope="{ row }"
        slot="platformFlow"
        v-if="form.activityType == 3"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.platformFlow"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.platformFlow }}</span>
      </template>

      <template
        slot-scope="{ row }"
        slot="gameCategory"
        v-if="form.activityType == 3"
      >
        <Select v-model="row.gameCategory" v-if="row.isEdit">
          <Option
            :value="item.value"
            v-for="(item, index) in game_type"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
        <div v-else>
          <span
            v-for="(items, index) in game_type"
            :key="index"
            v-if="row.gameCategory == items.value"
            >{{ items.label }}</span
          >
        </div>
      </template>

      <template
        slot-scope="{ row }"
        slot="gameTypeFlow"
        v-if="form.activityType == 3"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.gameTypeFlow"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.gameTypeFlow }}</span>
      </template>

      <template slot-scope="{ row }" slot="amount">
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.amount"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.amount }}</span>
      </template>

      <template slot-scope="{ row }" slot="integration">
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.integration"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.integration }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="actions">
        <template v-if="!row.isEdit">
          <Button type="primary" @click="editLadder(row, index)">编辑</Button
          >&nbsp;
          <Button
            type="error"
            @click="delLadder(row, index)"
            :loading="btnLoading"
            >删除</Button
          >
        </template>
        <template v-else>
          <Button
            type="primary"
            @click="saveLadder(row, index)"
            :loading="btnLoading"
            >保存</Button
          >&nbsp;
          <Button
            type="error"
            @click="delLadder(row, index)"
            :loading="btnLoading"
            >删除</Button
          >
        </template>
      </template>
    </Table>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import uploadButton from '@/components/upload-button/index';
import { game_type, registerConditions, game_platform } from '@/config/enum';
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
  components: {
    uploadButton,
  },
  data() {
    return {
      hasSaved: false,
      game_type,
      registerConditions,
      game_platform,
      btnLoading: false,
      loading: false,
      columns: [],
      ladder: [],
      rules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        imageUrl: [
          { required: true, message: '请上传列表图片', trigger: 'blur' },
        ],
        detailImageUrl: [
          { required: true, message: '请上传内容图片', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    addLadder() {
      const some = this.ladder.some(v => v.isEdit);
      if (some) {
        this.$Message.error('请先完成编辑');
        return;
      }
      if (this.form.id) {
        this.ladder.push({
          isEdit: true,
          isNew: true,
        });
      } else {
        if (this.form.activityType == 1) {
          this.ladder.push({
            activityId: this.form.activityId,
            registerCondition: 1,
            amount: 0,
            integration: 0,
            isEdit: true,
            isNew: true,
          });
        } else if (this.form.activityType == 2) {
          this.ladder.push({
            fullAmount: 0,
            isFirstCharge: true,
            amount: 0,
            integration: 0,
            isEdit: true,
            isNew: true,
          });
        } else if (this.form.activityType == 3) {
          this.ladder.push({
            platformType: 1,
            platformFlow: 0,
            gameCategory: 1,
            amount: 0,
            integration: 0,
            isEdit: true,
            isNew: true,
          });
        }
      }
    },
    async delLadder(row, index) {
      if (row.isNew) {
        this.$Message.success('删除成功');
        this.ladder.splice(index, 1);
      } else {
        if (this.form.id) {
          this.btnLoading = true;
          const res = await del_activity_detail_page(row.id);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success('删除成功');
            this.ladder.splice(index, 1);
          } else {
            this.$Message.error('删除失败');
          }
        } else {
          this.$Message.success('删除成功');
          this.ladder.splice(index, 1);
        }
      }
    },
    //
    async saveLadder(row, index) {
      row.isEdit = false;
      row.isNew = false;
      if (this.form.id) {
        this.btnLoading = true;
        if (row.id) {
          const res = await edit_activity_detail_page(row.id, row);
          if (res.status < 400) {
            this.$Message.success('保存成功');
          }
        } else {
          row.activityId = this.form.id;
          const res = await add_activity_detail_page(row);
          if (res.status < 400) {
            this.$Message.success('保存成功');
          }
        }
        this.btnLoading = false;
        this.getData();
        this.hasSaved = true;
      } else {
        this.ladder.splice(index, 1, row);
        this.$Message.success('保存成功');
        this.hasSaved = true;
      }
    },
    //
    editLadder(row, index) {
      const some = this.ladder.some(v => v.isEdit);
      if (some) {
        return this.$Message.error('请先完成编辑');
      }
      row.isEdit = true;
      this.ladder.splice(index, 1, row);
    },
    async getData() {
      if (this.form.id) {
        this.loading = true;
        const res = await get_activity_detail_page(this.form.id);
        this.loading = false;
        if (res.status < 400) {
          this.ladder = res.data;
          this.ladder.forEach(v => {
            v.isEdit = false;
            v.activityId = this.form.id;
          });
        }
      }
    },
    init() {
      if (this.form.activityType == 1) {
        this.columns = [
          {
            title: '注册条件',
            key: 'registerCondition',
            slot: 'registerCondition',
          },
          {
            title: '红包',
            key: 'amount',
            slot: 'amount',
          },
          {
            title: '积分',
            key: 'integration',
            slot: 'integration',
          },
          {
            title: '操作',
            slot: 'actions',
            width: 180,
          },
        ];
      } else if (this.form.activityType == 2) {
        this.columns = [
          {
            title: '充值金额或流水金额',
            key: 'fullAmount',
            slot: 'fullAmount',
          },
          {
            title: '是否首次充值',
            key: 'isFirstCharge',
            slot: 'isFirstCharge',
          },
          {
            title: '红包',
            key: 'amount',
            slot: 'amount',
          },
          {
            title: '积分',
            key: 'integration',
            slot: 'integration',
          },
          {
            title: '操作',
            slot: 'actions',
            width: 180,
          },
        ];
      } else {
        this.columns = [
          {
            title: '平台类型',
            key: 'platformType',
            slot: 'platformType',
          },
          {
            title: '平台流水',
            key: 'platformFlow',
            slot: 'platformFlow',
          },
          {
            title: '游戏类型',
            key: 'gameCategory',
            slot: 'gameCategory',
          },
          {
            title: '游戏类型流水',
            key: 'gameTypeFlow',
            slot: 'gameTypeFlow',
          },
          {
            title: '红包',
            key: 'amount',
            slot: 'amount',
          },
          {
            title: '积分',
            key: 'integration',
            slot: 'integration',
          },
          {
            title: '操作',
            slot: 'actions',
            width: 180,
          },
        ];
      }
    },
  },
  mounted() {
    // console.log(this.form);
    this.init();
    this.getData();
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
