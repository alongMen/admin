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
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="logo">
          <img :src='row.logo' width='50' height='50' v-if='row.logo'></img>
        </template>
        <template slot-scope="{ row }" slot="totalRecharge">
          <span>{{ parsePrice(row.totalRecharge) }}</span>
        </template>
        <template slot-scope="{ row }" slot="totalConsume">
          <span>{{ parsePrice(row.totalConsume) }}</span>
        </template>
        <!-- <template slot-scope="{ row }" slot="offlineTotalFlow">
          <span>{{ parsePrice(row.offlineTotalFlow) }}</span>
        </template> -->
        <template slot-scope="{ row }" slot="default">
          <i-switch
            v-model="row.default"
            size="large"
            @on-change="value => setDefault(value, row)"
            :loading="btnLoading"
            v-if="!row.default && row.status === 1"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="green" v-if="row.default && row.status === 1"
            >是</Tag
          >
          <Tag color="red" v-if="!row.default && row.status === 2">否</Tag>
        </template>
        <template slot-scope="{ row,index }" slot="status">
          <i-switch
            v-model="row.status"
            size="large"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
            v-if="!row.default"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
          <Tag color="green" v-else>启用</Tag>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>&nbsp;
          <Button type="primary" @click="commission(row)">佣金设置</Button>
        </template>
      </Table>
    </div>
    <Modal :title="title" v-model="showModal" :mask-closable="false">
      <Form ref="form" :model="form" label-position="top" :rules="rules">
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="code" prop="code">
          <Input v-model="form.code"></Input>
        </FormItem>
        <FormItem label="logo">
          <upload-button v-model="form.logo" :accept='"image/*"'/>
        </FormItem>
        <FormItem label="直接下级注册人数" prop="agentNumber">
          <InputNumber v-model="form.agentNumber" :min="0"></InputNumber>
        </FormItem>
        <FormItem label="代理总充值金额" prop="totalRecharge">
          <InputNumber v-model="form.totalRecharge" :min="0"></InputNumber>
        </FormItem>
        <FormItem label="代理总消费金额" prop="totalConsume">
          <InputNumber v-model="form.totalConsume" :min="0"></InputNumber>
        </FormItem>
        <!-- <FormItem label="下线总流水" prop="offlineTotalFlow">
          <InputNumber v-model="form.offlineTotalFlow" :min="0"></InputNumber>
        </FormItem> -->
        <FormItem label="是否默认" prop="default">
          <i-switch
            v-model="form.default"
            size="large"
            :loading="btnLoading"
            v-if="data.length > 0"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
         </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="showModal = false"
          >取消</Button
        >
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Modal>
    <Drawer :title="title" v-model="showDraw" width="70" @on-close="close" >
      <commission-config v-if="step === 1" :form="form" @close='close'/>
      
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import uploadButton from "@/components/upload-button/index";
import {
  get_agent_level_list,
  create_agent_lervel,
  update_agent_lervel,
  state_agent_lervel,
  default_agent_lervel,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import  CommissionConfig  from './components/commission-config.vue';
export default {
  components:{
    CommissionConfig,
    uploadButton
  },
  name: 'agent-level',
  mixins: [mixin],
  data() {
    return {
      step: 0,
      showDraw:false,
      columns: [
        {
          title: '名称',
          key: 'name',
        },
        {
          title: 'code',
          key: 'code',
        },
        {
          title: 'logo',
          key: 'logo',
          slot: 'logo',
        },
        {
          title: '直接下级注册人数',
          key: 'agentNumber',
        },
        {
          title: '代理总充值金额',
          slot: 'totalRecharge',
        },
        {
          title: '代理总消费金额',
          slot: 'totalConsume',
        },
        // {
        //   title: '下线总流水',
        //   slot: 'offlineTotalFlow',
        // },

        {
          title: '是否默认',
          key: 'default',
          slot: 'default',
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 200,
        },
      ],
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写开code', trigger: 'blur' }],
        agentNumber: [
          {
            required: true,
            type: 'number',
            message: '请填写直接下级注册人数',
            trigger: 'blur',
          },
        ],
        totalRecharge: [
          {
            required: true,
            type: 'number',
            message: '请填写代理总充值金额',
            trigger: 'blur',
          },
        ],
        totalConsume: [
          {
            required: true,
            type: 'number',
            message: '请填写代理总消费金额',
            trigger: 'blur',
          },
        ],
        offlineTotalFlow: [
          {
            required: true,
            type: 'number',
            message: '请填写下线总流水',
            trigger: 'blur',
          },
        ],
      },
      title: '',
      form: {},
    };
  },
  computed: {
    defaultForm() {
      return [];
    },
    moreForm() {
      return [];
    },
  },
  methods: {
    close(){
      this.showDraw = false
      this.form = {}
      this.step = 0
    },
    add() {
      this.form = {
        agentNumber: 0,
        totalRecharge: 0,
        totalConsume: 0,
        offlineTotalFlow: 0,
      };
      if (this.data.length === 0) {
        this.form.default = true;
      }else{
        this.form.default = false;
      }
      this.title = '添加等级';
      this.showModal = true;
    },
    async edit(row) {
      this.title = '编辑等级';
      this.showModal = true;
      this.form = cloneDeep(row);
    },
    commission(row) {
      this.title = '佣金设置';
      this.step = 1;
      this.showDraw = true;
      this.form = cloneDeep(row);
    },
    async setDefault(value, row) {
      this.$Modal.confirm({
        title: `设置默认`,
        loading: true,
        content: `<p>是否设该等级为默认</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await default_agent_lervel(row.id);
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
    async setState(value, row,index) {
      let state;
      let title;
      if (value === 1) {
        state = 1;
        title = '开启';
      } else {
        state = 2;
        title = '关闭';
      }
      this.$Modal.confirm({
        title: `${title}等级`,
        loading: true,
        content: `<p>是否${title}该等级</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await state_agent_lervel(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}等级成功`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value === 1) {
              row.status = 2;
            } else {
              row.status = 1;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value === 1) {
            row.status = 2;
          } else {
            row.status = 1;
          }
          this.data.splice(index,1,row);
        },
      });
    },
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.btnLoading = true;
      if (this.form.id) {
        const res = await update_agent_lervel(this.form.id, this.form);
        if (res.status < 400) {
          this.$Message.success('修改等级成功');
        }
      } else {
        const res = await create_agent_lervel(this.form);
        if (res.status < 400) {
          this.$Message.success('添加等级成功');
        }
      }
      this.btnLoading = false;
      this.showModal = false;
      this.page = 1;
      this.getData();
    },
    async getData() {
      this.loading = true;
      const res = await get_agent_level_list(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data;
        const max_defalut = Math.max.apply(
          Math,
          this.data.map(function(o) {
            return o.default;
          }),
        );
        this.data.forEach(v => {
          if (v.default === max_defalut && max_defalut !== 0) {
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
