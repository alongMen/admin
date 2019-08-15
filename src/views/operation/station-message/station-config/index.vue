<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />
    <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div>
    <div class="table-area">
      <p>充值成功模版</p>
      <Table :columns="columns" :data="rechargeSuccess" :loading="loading">
        <template slot-scope="{ row }" slot="default">
          <i-switch
            v-model="row.default"
            size="large"
            @on-change="value => setDefault(value, row)"
            :loading="btnLoading"
            v-if="!row.default"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }}</span>
        </template>
        <template slot-scope="{ row }" slot="noticeType">
          {{ noticeTypeName(row) }}
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">{{
            row.isInitial ? '查看' : '编辑'
          }}</Button
          >&nbsp;
          <Button type="error" @click="del(row)" v-if="!row.isInitial"
            >删除</Button
          >
        </template>
      </Table>
      <br />

      <p>充值失败模版</p>
      <Table
        :columns="columns"
        :data="rechargeFail"
        :loading="loading"
        :show-header="false"
      >
        <template slot-scope="{ row }" slot="default">
          <i-switch
            v-model="row.default"
            size="large"
            @on-change="value => setDefault(value, row)"
            :loading="btnLoading"
            v-if="!row.default"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }}</span>
        </template>
        <template slot-scope="{ row }" slot="noticeType">
          {{ noticeTypeName(row) }}
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">{{
            row.isInitial ? '查看' : '编辑'
          }}</Button
          >&nbsp;
          <Button type="error" @click="del(row)" v-if="!row.isInitial"
            >删除</Button
          >
        </template>
      </Table>
      <br />

      <p>提现成功模版</p>
      <Table
        :columns="columns"
        :data="withdrawSuccess"
        :loading="loading"
        :show-header="false"
      >
        <template slot-scope="{ row }" slot="default">
          <i-switch
            v-model="row.default"
            size="large"
            @on-change="value => setDefault(value, row)"
            :loading="btnLoading"
            v-if="!row.default"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }}</span>
        </template>
        <template slot-scope="{ row }" slot="noticeType">
          {{ noticeTypeName(row) }}
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">{{
            row.isInitial ? '查看' : '编辑'
          }}</Button
          >&nbsp;
          <Button type="error" @click="del(row)" v-if="!row.isInitial"
            >删除</Button
          >
        </template>
      </Table>
      <br />

      <p>提现失败模版</p>
      <Table
        :columns="columns"
        :data="withdrawFail"
        :loading="loading"
        :show-header="false"
      >
        <template slot-scope="{ row }" slot="default">
          <i-switch
            v-model="row.default"
            size="large"
            @on-change="value => setDefault(value, row)"
            :loading="btnLoading"
            v-if="!row.default"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
        </template>
        <template slot-scope="{ row }" slot="noticeType">
          {{ noticeTypeName(row) }}
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }}</span>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">{{
            row.isInitial ? '查看' : '编辑'
          }}</Button
          >&nbsp;
          <Button type="error" @click="del(row)" v-if="!row.isInitial"
            >删除</Button
          >
        </template>
      </Table>
      <br />

      <p>佣金模版</p>
      <Table
        :columns="columns"
        :data="commissionsSuccess"
        :loading="loading"
        :show-header="false"
      >
        <template slot-scope="{ row }" slot="default">
          <i-switch
            v-model="row.default"
            size="large"
            @on-change="value => setDefault(value, row)"
            :loading="btnLoading"
            v-if="!row.default"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
        </template>
        <template slot-scope="{ row }" slot="noticeType">
          {{ noticeTypeName(row) }}
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }}</span>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">{{
            row.isInitial ? '查看' : '编辑'
          }}</Button
          >&nbsp;
          <Button type="error" @click="del(row)" v-if="!row.isInitial"
            >删除</Button
          >
        </template>
      </Table>
    </div>
    <Drawer :title="title" v-model="showModal" width="70">
      <Form ref="form" :model="form" label-position="top" :rules="rules">
        <FormItem label="标题" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="消息类型" prop="noticeType">
          <Select v-model="form.noticeType">
            <Option
              v-for="item in noticeType"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="模版" prop="template">
          <Input type="textarea" v-model="form.template" :rows="4" />
        </FormItem>
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="showModal = false"
          >取消</Button
        >
        <Button
          type="primary"
          :loading="btnLoading"
          @click="ok"
          v-if="!form.isInitial"
          >确定</Button
        >
      </div>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import { noticeType } from '@/config/enum';
import { cloneDeep } from 'lodash';
import {
  get_notice_config_all,
  create_notice_config,
  update_notice_config,
  delete_notice_config,
  set_default_notice_config,
} from '@/service/index';
export default {
  name: 'station-config',
  mixins: [mixin],
  data() {
    return {
      rechargeSuccess: [],
      rechargeFail: [],
      withdrawSuccess: [],
      withdrawFail: [],
      commissionsSuccess: [],
      noticeType,
      columns: [
        {
          title: '名称',
          key: 'name',
        },
        {
          title: '消息类型',
          slot: 'noticeType',
        },
        {
          title: '是否默认',
          slot: 'default',
        },
        {
          title: '创建时间',
          slot: 'createTime',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 180,
        },
      ],
      rules: {
        name: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        template: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        noticeType: [
          {
            required: true,
            type: 'number',
            message: '请填写内容',
            trigger: 'change',
          },
        ],
      },
      title: '',
      form: {},
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          label: '时间段',
          type: 'timeRange',
          field: 'date',
        },
        {
          label: '名称',
          type: 'text',
          field: 'name',
        },
      ];
    },
    moreForm() {
      return [];
    },
  },
  methods: {
    add() {
      this.form = {};
      this.title = '添加站内信配置';
      this.showModal = true;
    },
    async edit(row) {
      this.title = '编辑站内信配置';
      this.showModal = true;
      this.form = cloneDeep(row);
    },
    noticeTypeName(row) {
      let name;
      this.noticeType.forEach(v => {
        if (v.value === row.noticeType) {
          name = v.label;
        }
      });
      return name;
    },
    async setDefault(value, row) {
      this.$Modal.confirm({
        title: `设置默认`,
        loading: true,
        content: `<p>是否设该等级为默认</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_default_notice_config(row.id);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`设置成功`);
            this.$Modal.remove();
            this.getData();
          } else {
            if (value) {
              row.default = false;
            }
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value) {
            row.default = false;
          }
        },
      });
    },
    async del(row) {
      this.$Modal.confirm({
        title: '删除',
        loading: true,
        content: '<p>是否删除该站内信配置</p>',
        onOk: async () => {
          const res = await delete_notice_config(row.id);
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
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.btnLoading = true;
      if (this.form.id) {
        const res = await update_notice_config(this.form.id, this.form);
        if (res.status < 400) {
          this.$Message.success('修改公告成功');
        }
      } else {
        const res = await create_notice_config(this.form);
        if (res.status < 400) {
          this.$Message.success('添加公告成功');
        }
      }
      this.btnLoading = false;
      this.showModal = false;
      this.page = 1;
      this.getData();
    },
    async getData() {
      this.loading = true;
      const query = {
        name: this.query.name,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      };
      const res = await get_notice_config_all(query);
      this.loading = false;
      this.rechargeSuccess = [];
      this.rechargeFail = [];
      this.withdrawSuccess = [];
      this.withdrawFail = [];
      this.commissionsSuccess = [];
      if (res.status < 400) {
        res.data.forEach(v => {
          if (v.noticeType === 51) {
            this.rechargeSuccess.push(v);
          } else if (v.noticeType === 52) {
            this.rechargeFail.push(v);
          } else if (v.noticeType === 61) {
            this.withdrawSuccess.push(v);
          } else if (v.noticeType === 62) {
            this.withdrawFail.push(v);
          } else if (v.noticeType === 70) {
            this.commissionsSuccess.push(v);
          }
        });

        const max_rechargeSuccess_defalut = Math.max.apply(
          Math,
          this.rechargeSuccess.map(function(o) {
            return o.default;
          }),
        );
        const max_rechargeFail_defalut = Math.max.apply(
          Math,
          this.rechargeFail.map(function(o) {
            return o.default;
          }),
        );
        const max_withdrawSuccess_defalut = Math.max.apply(
          Math,
          this.withdrawSuccess.map(function(o) {
            return o.default;
          }),
        );
        const max_withdrawFail_defalut = Math.max.apply(
          Math,
          this.withdrawFail.map(function(o) {
            return o.default;
          }),
        );
        const max_commissionsSuccess_defalut = Math.max.apply(
          Math,
          this.commissionsSuccess.map(function(o) {
            return o.default;
          }),
        );
        this.rechargeSuccess.forEach(v => {
          if (
            v.default === max_rechargeSuccess_defalut &&
            max_rechargeSuccess_defalut !== 0
          ) {
            v.default = true;
          } else {
            v.default = false;
          }
        });
        this.rechargeFail.forEach(v => {
          if (
            v.default === max_rechargeFail_defalut &&
            max_rechargeFail_defalut !== 0
          ) {
            v.default = true;
          } else {
            v.default = false;
          }
        });
        this.withdrawSuccess.forEach(v => {
          if (
            v.default === max_withdrawSuccess_defalut &&
            max_withdrawSuccess_defalut !== 0
          ) {
            v.default = true;
          } else {
            v.default = false;
          }
        });
        this.withdrawFail.forEach(v => {
          if (
            v.default === max_withdrawFail_defalut &&
            max_withdrawFail_defalut !== 0
          ) {
            v.default = true;
          } else {
            v.default = false;
          }
        });
        this.commissionsSuccess.forEach(v => {
          if (
            v.default === max_commissionsSuccess_defalut &&
            max_commissionsSuccess_defalut !== 0
          ) {
            v.default = true;
          } else {
            v.default = false;
          }
        });
      }
    },
  },
};
</script>
