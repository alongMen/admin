<template>
  <div class="draw-setting">
    <Form ref="form" :rules="rules" :model="form" label-position="top">
      <Row>
        <Col span="8" style="margin-top:20px;">
          <FormItem label="单笔最小出款：">
            <Input-number v-model="form.singleMin" :min="1"></Input-number> 元
          </FormItem>
        </Col>
        <Col span="8" style="margin-top:20px;">
          <FormItem label="单笔最大出款：">
            <Input-number v-model="form.singleMax" :min="1"></Input-number> 元
          </FormItem>
        </Col>
        <Col span="8" style="margin-top:20px;">
          <FormItem label="流水额度：">
            <Input-number v-model="form.flowLimit" :min="0"></Input-number> %
          </FormItem>
        </Col>
        <Col span="8" style="margin-top:20px;">
          <FormItem label="未达到流水是否提款：">
            <i-switch v-model="form.isNotFlowToCash" size="large">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
        </Col>
        <Col span="8" v-if="form.isNotFlowToCash">
          <FormItem label="行政费率：">
            <Input-number
              v-model="form.serviceRate"
              :min="0"
              :max="100"
            ></Input-number>
            %
          </FormItem>
        </Col>
        <Col span="8" v-if="form.isNotFlowToCash">
          <FormItem label="行政费上限（0为无上限）：">
            <Input-number v-model="form.serviceMaxFee" :min="0"></Input-number>
            元
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8">
          <FormItem label="充值流水是否清零：">
            <i-switch v-model="form.isRechargeFlowZero" size="large">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="单日提现次数：">
            <InputNumber
              v-model="form.todayTimes"
              placeholder=""
              :min="1"
            ></InputNumber>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="免手续费次数：">
            <Input-number :min="0" v-model="form.freeFeeTimes"></Input-number>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <p>出款手续费阶梯:</p>
    <br />
    <Button type="primary" @click="addLadder">添加</Button>
    <Table :data="ladder" :columns="columns" :loading="loading">
      <template slot-scope="{ row }" slot="histortyRecharge">
        <Input-number
          :min="0"
          v-model="row.histortyRecharge"
          v-if="row.isEdit"
        ></Input-number>
        <span v-else>{{ parsePrice(row.histortyRecharge) }}</span>
      </template>

      <template slot-scope="{ row }" slot="serviceRate">
        <template v-if="row.isEdit">
          <Input-number
            :min="0"
            v-model="row.serviceRate"
            :max="100"
          ></Input-number>
        </template>
        <span v-else>{{ row.serviceRate }}</span>
        %
      </template>

      <template slot-scope="{ row }" slot="serviceMaxFee">
        <Input-number
          :min="0"
          v-model="row.serviceMaxFee"
          v-if="row.isEdit"
        ></Input-number>
        <span v-else>{{ parsePrice(row.serviceMaxFee) }}</span>
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
import {
  get_withdraw_rule_fees,
  create_withdraw_rule_fee,
  update_withdraw_rule_fee,
  delete_withdraw_rule_fee,
} from '@/service/index';
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
          title: '历史总存款',
          key: 'histortyRecharge',
          slot: 'histortyRecharge',
        },
        {
          title: '手续费率',
          key: 'serviceRate',
          slot: 'serviceRate',
        },
        {
          title: '手续费上限(0为无上限)',
          key: 'serviceMaxFee',
          slot: 'serviceMaxFee',
        },

        {
          title: '操作',
          slot: 'actions',
        },
      ],
      ladder: [],
      rules: {},
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
          withdrawalRuleId: this.form.id,
          histortyRecharge: 1,
          serviceRate: 0,
          serviceMaxFee: 0,
          isEdit: true,
          isNew: true,
        });
      } else {
        this.ladder.push({
          histortyRecharge: 0,
          serviceRate: 0,
          serviceMaxFee: 0,
          isEdit: true,
          isNew: true,
        });
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
          const res = await delete_withdraw_rule_fee(row.id);
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
      if (row.histortyRecharge === 0) {
        this.$Message.error('历史存款总额必须大于0!');
        return;
      }
      if (row.serviceRate === 0 || row.serviceRate === 100) {
        this.$Message.error('服务费率必须在0～100%之间');
        return;
      }
      const currentTotal = row.histortyRecharge;
      if (index !== 0) {
        const lastTotal = this.ladder[index - 1].histortyRecharge;
        if (currentTotal <= lastTotal) {
          this.$Message.error('历史存款总额必须大于上条!');
          return;
        }
      }
      if (this.ladder[index + 1]) {
        const nextTotal = this.ladder[index + 1].histortyRecharge;
        if (currentTotal >= nextTotal) {
          this.$Message.error('历史存款总额必须小于下条!');
          return;
        }
      }
      row.isEdit = false;
      row.isNew = false;
      if (this.form.id) {
        this.btnLoading = true;
        row.serviceRate = this.toDecimal(row.serviceRate);
        if (row.id) {
          const res = await update_withdraw_rule_fee(row.id, row);
          if (res.status < 400) {
            this.$Message.success('保存一条手续费信息成功');
          }
        } else {
          const res = await create_withdraw_rule_fee(row);
          if (res.status < 400) {
            this.$Message.success('保存一条手续费信息成功');
          }
        }
        this.btnLoading = false;
        this.getData();
      } else {
        this.ladder.splice(index, 1, row);
        this.$Message.success('保存一条手续费信息成功');
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
        const res = await get_withdraw_rule_fees(this.form.id);
        this.loading = false;
        if (res.status < 400) {
          this.ladder = res.data;
          this.ladder.forEach(v => {
            v.isEdit = false;
            v.serviceRate = this.toPercent(v.serviceRate);
            v.withdrawalRuleId = this.form.id;
          });
        }
      }
    },
  },
  mounted() {
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
