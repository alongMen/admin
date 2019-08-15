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
          <Button type="primary" @click="charge(row)">充值配置</Button>&nbsp;
          <Button type="primary" @click="withdraw(row)">提现配置</Button>&nbsp;
          <Button type="primary" @click="rakeback(row)">返水配置</Button>
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
        <FormItem label="积分" prop="integration">
          <InputNumber v-model="form.integration" :min="0"></InputNumber>
        </FormItem>
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
      <charge-config v-if="step === 1" :form="form" @close='close'/>
      <draw-config v-if="step === 2" :form="form" @close='close' @getFatherData='getData'/>
      <rakeback-config v-if="step === 3" :form="form" @close='close'/>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import uploadButton from "@/components/upload-button/index";
import {
  get_member_level_list,
  create_menber_lervel,
  update_menber_lervel,
  state_menber_lervel,
  default_menber_lervel,
  get_menber_lervel_payment_config,
  select_menber_lervel_payment_config,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import  ChargeConfig  from './components/charge-config';
import  RakebackConfig  from './components/rakeback-config';
import  DrawConfig  from './components/draw-config';
export default {
  name: 'member-level',
  mixins: [mixin],
  components: {
    ChargeConfig,
    DrawConfig,
    RakebackConfig,
    uploadButton
  },
  data() {
    return {
      showDraw: false,
      step: 0,
      initContent: '',
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
          title: '积分',
          key: 'integration',
        },
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
          width: 400,
        },
      ],
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写开code', trigger: 'blur' }],
        integration: [
          {
            required: true,
            type: 'number',
            message: '请填写积分',
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
        integration: 0,
      };
      if (this.data.length === 0) {
        this.form.default = true;
      }else{
        this.form.default = false;
      }
      this.title = '添加等级';
      this.showModal = true;
    },
    edit(row) {
      this.title = '编辑等级';
      this.showModal = true;
      this.form = cloneDeep(row);
    },
    charge(row) {
      this.title = '充值设置';
      this.step = 1;
      this.showDraw = true;
      this.form = cloneDeep(row);
    },
    withdraw(row) {
      this.title = '提现设置';
      this.step = 2;
      this.showDraw = true;
      this.form = cloneDeep(row);
    },
    rakeback(row) {
      this.title = '返水设置';
      this.step = 3;
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
          const res = await default_menber_lervel(row.id);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`设置成功`);
            this.$Modal.remove();
            this.getData();
          } else {
            if (value ) {
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
          const res = await state_menber_lervel(row.id, state);
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
        const res = await update_menber_lervel(this.form.id, this.form);
        if (res.status < 400) {
          this.$Message.success('修改等级成功');
        }
      } else {
        const res = await create_menber_lervel(this.form);
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
      const res = await get_member_level_list(
        this.page,
        this.limit,
        this.query,
      );
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
  mounted() {
    this.getData();
  },
};
</script>
