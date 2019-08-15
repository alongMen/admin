<template>
  <div class="draw-setting">
    <Form ref="form" :rules="rules" :model="form" :label-width="100">
      <Row>
        <Col span="12">
          <FormItem label="任务标题：" prop="title">
            <Input v-model="form.title"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="任务类型：" prop="missionType">
            <RadioGroup v-model="form.missionType" @on-change="init">
              <Radio :label="1" :disabled="form.id || hasSaved">注册</Radio>
              <Radio :label="2" :disabled="form.id || hasSaved">充值</Radio>
              <Radio :label="3" :disabled="form.id || hasSaved">推广</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <FormItem label="任务内容：" prop="description">
            <Input v-model="form.description"></Input>
          </FormItem>
        </Col>
        <Col span="12" v-if="!form.id">
          <FormItem label="状态：" prop="status">
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
      任务详情:<span
        v-if="!form.id"
        style="padding-left:10px;font-weight:400;font-size:8px;"
        >( 请选择任务类型后方可添加详情! )</span
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
        slot="totalRegister"
        v-if="form.missionType == 1"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.totalRegister"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.totalRegister }}</span>
      </template>
      <template
        slot-scope="{ row }"
        slot="totalAgent"
        v-if="form.missionType == 1"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.totalAgent"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.totalAgent }}</span>
      </template>

      <template
        slot-scope="{ row }"
        slot="totalRecharge"
        v-if="form.missionType == 2"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.totalRecharge"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.totalRecharge }}</span>
      </template>

      <template
        slot-scope="{ row }"
        slot="gameCategory"
        v-if="form.missionType == 3"
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
        slot="totalGameTypeFlow"
        v-if="form.missionType == 3"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.totalGameTypeFlow"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.totalGameTypeFlow }}</span>
      </template>

      <template
        slot-scope="{ row }"
        slot="gamePlatform"
        v-if="form.missionType == 3"
      >
        <Select v-model="row.gamePlatform" v-if="row.isEdit">
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
            v-if="row.gamePlatform == items.value"
            >{{ items.label }}</span
          >
        </div>
      </template>
      <template
        slot-scope="{ row }"
        slot="totalPlatformFlow"
        v-if="form.missionType == 3"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.totalPlatformFlow"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.totalPlatformFlow }}</span>
      </template>
      <template
        slot-scope="{ row }"
        slot="totalAmount"
        v-if="form.missionType == 3"
      >
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.totalAmount"
            :max="999999"
          ></Input-number>
        </template>
        <span v-else>{{ row.totalAmount }}</span>
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
      <template slot-scope="{ row }" slot="liveness">
        <template v-if="row.isEdit">
          <Input-number
            :min="5"
            v-model="row.liveness"
            :max="100"
          ></Input-number>
        </template>
        <span v-else>{{ row.liveness }}</span>
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
</template>

<script>
import { cloneDeep } from 'lodash';
import mixin from '@/mixins/single-form-mixin';
import { game_type, game_platform } from '@/config/enum';
import {
  get_Mission_detail_page,
  add_Mission_detail_page,
  edit_Mission_detail_page,
  del_Mission_detail_page,
} from '@/service/index';
export default {
  name: 'draw-setting-editform',
  mixins: [mixin],
  props: {
    form: Object,
  },
  data() {
    return {
      hasSaved: false,
      game_type,
      game_platform,
      btnLoading: false,
      loading: false,
      columns: [],
      ladder: [],
      rules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        description: [
          { required: true, message: '请填写内容', trigger: 'blur' },
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
        if (this.form.missionType == 1) {
          this.ladder.push({
            totalRegister: 0,
            totalAgent: 0,
            amount: 0,
            integration: 0,
            liveness: 0,
            isEdit: true,
            isNew: true,
          });
        } else if (this.form.missionType == 2) {
          this.ladder.push({
            totalRecharge: 0,
            amount: 0,
            integration: 0,
            liveness: 0,
            isEdit: true,
            isNew: true,
          });
        } else if (this.form.missionType == 3) {
          this.ladder.push({
            gameCategory: 1,
            totalGameTypeFlow: 0,
            gamePlatform: 1,
            totalPlatformFlow: 0,
            totalAmount: 0,
            amount: 0,
            integration: 0,
            liveness: 0,
            isEdit: true,
            isNew: true,
          });
        }
      }
    },
    //
    async delLadder(row, index) {
      if (row.isNew) {
        this.$Message.success('删除成功');
        this.ladder.splice(index, 1);
      } else {
        if (this.form.id) {
          this.btnLoading = true;
          const res = await del_Mission_detail_page(row.id);
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
          const res = await edit_Mission_detail_page(row.id, row);
          if (res.status < 400) {
            this.$Message.success('保存成功');
          }
        } else {
          row.missionId = this.form.id;
          const res = await add_Mission_detail_page(row);
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
        const res = await get_Mission_detail_page(
          this.form.id,
          this.page,
          this.limit,
        );
        this.loading = false;
        if (res.status < 400) {
          this.ladder = res.data.itemList;
          this.total = res.data.itemTotal;
        }
      }
    },
    init() {
      if (this.form.missionType == 1) {
        this.columns = [
          {
            title: '下级新注册人数',
            key: 'totalRegister',
            slot: 'totalRegister',
          },
          {
            title: '下级新晋代理数量',
            key: 'totalAgent',
            slot: 'totalAgent',
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
            title: '活跃度',
            key: 'liveness',
            slot: 'liveness',
          },
          {
            title: '操作',
            slot: 'actions',
            width: 180,
          },
        ];
      } else if (this.form.missionType == 2) {
        this.columns = [
          {
            title: '今日充值量',
            key: 'totalRecharge',
            slot: 'totalRecharge',
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
            title: '活跃度',
            key: 'liveness',
            slot: 'liveness',
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
            title: '游戏平台',
            key: 'gamePlatform',
            slot: 'gamePlatform',
          },
          {
            title: '今日平台流水',
            key: 'totalPlatformFlow',
            slot: 'totalPlatformFlow',
          },
          {
            title: '游戏类型',
            key: 'gameCategory',
            slot: 'gameCategory',
          },
          {
            title: '今日游戏类型流水',
            key: 'totalGameTypeFlow',
            slot: 'totalGameTypeFlow',
          },
          {
            title: '今日总流水',
            key: 'totalAmount',
            slot: 'totalAmount',
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
            title: '活跃度',
            key: 'liveness',
            slot: 'liveness',
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
    // console.log(this.game_platform);
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
