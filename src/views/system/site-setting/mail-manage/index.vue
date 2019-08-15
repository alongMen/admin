<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="[]"
      v-model="query"
    />
    <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div>
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row,index }" slot="actions">
          <Button type="primary"  @click="edit(row,index)">编辑</Button>&nbsp;
          <Button type="error"  @click="remove(row)">删除</Button>
        </template>
         <template slot-scope="{ row }" slot="isValid">
           <Tag color='green' v-if='row.isValid' >是</Tag>
           <Tag color='red' v-else >否</Tag>
        </template>
        <template slot-scope="{ row ,index}" slot="isDefault">
          <i-switch
            v-model="row.isDefault"
            size="large"
            @on-change="value => setDefault(value, row,index)"
            :loading="btnLoading"
            v-if="row.status === 1 && !row.isDefault"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tag color="red" v-if="row.status === 2">否</Tag>
          <Tag color="green" v-if="row.status === 1 && row.isDefault">是</Tag>
        </template>
         <template slot-scope="{ row }" slot="createTime">
           {{formatBeijingDate(row.createTime)}}
        </template>
        <template slot="status" slot-scope="{ row,index }">
          <i-switch
            v-model="row.status"
            size='large'
            :true-value="1"
            :false-value="2"
            @on-change="value => setStatus(value, row, index)"
            :loading="btnLoading"
            v-if="!row.isDefault"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
        </template>
      </Table>
      <div class="pagination" v-if="total > 0">
        <Page
          :total="10"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
        />
      </div>
    </div>
    <Modal :title="title" v-model="showModal" :mask-closable="false">
      <Form ref="form" :model="form" :rules="rules"  v-if='showModal' label-position="top">
        <FormItem label="SMTP服务器" prop="smtpServer">
          <Input v-model="form.smtpServer" ></Input>
        </FormItem>
        <FormItem label="用户名" prop="userName">
          <Input v-model="form.userName"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="form.password" type='password'></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirm">
          <Input v-model="form.confirm" type='password'></Input>
        </FormItem>
      
        <FormItem label="发送名称" prop="sendName">
          <Input v-model="form.sendName"></Input>
        </FormItem>
        <FormItem label="发送邮箱" prop="sendEmail">
          <Input v-model="form.sendEmail"></Input>
        </FormItem>
        <FormItem label="端口号" prop="port">
          <InputNumber v-model="form.port" :min='1'></InputNumber>
        </FormItem>
       
         
      </Form>
      <div slot="footer">
        <Button  @click="showModal = false">取消</Button>
        <Button  type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_mail_config_list,
  default_mail_config,
  create_mail_config,
  update_mail_config,
  remove_mail_config,
  set_state_mail_config
} from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  name: 'mail-manage',
  mixins: [mixin],
  data() {
    const validRepassword = (rule, value, cb) => {
      if (this.form.password && value !== this.form.password) {
        cb(new Error("两次密码不同"));
      } else {
        cb();
      }
    };
    return {
      data: [],
      columns: [
        {
          title: 'SMTP服务器',
          key: 'smtpServer',
        },
        {
          title: '用户名',
          key: 'userName',
        },
        {
          title: '发送名称',
          key: 'sendName',
        },
        {
          title: '发送email',
          key: 'sendEmail',
        },
        {
          title: '端口号',
          key: 'port',
        },
        {
          title: '创建时间',
          slot: 'createTime',
        },
        {
          title: '状态',
          slot: 'status',
        },
        {
          title: '是否默认',
          slot: 'isDefault',
        },
        {
          title: '操作',
          slot: 'actions',
          width:180
        },
      ],
      rules: {
        smtpServer: [{ required: true, message: '请填写SMTP地址', trigger: 'blur' }],
        userName: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        // securityStamp: [{ required: true, message: '请填写安全码', trigger: 'blur' }],
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        confirm: [{ validator: validRepassword, trigger: 'blur' }],
        sendName: [{ required: true, message: '请填写发送名称', trigger: 'blur' }],
        sendEmail: [{ required: true, message: '请填写发送邮箱', trigger: 'blur' },{ type: "email", message: "请输入正确格式email", trigger: "blur" }],
      },
      title: '',
      form: {},
      isDefault: false
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          label: "时间段",
          type: "timeRange",
          field: "date"
        },
        {
          label: '发送邮箱',
          type: 'text',
          field: 'sendEmail',
        },
      ];
    },
  },
  methods: {
    remove(row) {
      const id = row.id;
      this.$Modal.confirm({
        title: '删除邮件配置',
        content: '<p>确定删除邮件配置?</p>',
        loading: true,
        onOk: async () => {
          const res = await remove_mail_config(id);
          this.$Modal.remove();
          if (res.status < 400) {
            this.$Message.success('删除邮件配置成功！');
            this.page = 1;
            this.getData();
          }
        },
      });
    },
    //
    add() {
      this.title = '添加邮件配置';
      this.form = {status:1};
      this.showModal = true;
    },
    //
    edit(row,index) {
      // console.log(row,index);

      this.title = '修改邮件配置';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    //
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      if (this.form.id) {
        this.btnLoading = true;
        const res = await update_mail_config(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('修改邮件配置成功!');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      } else {
        this.btnLoading = true;
        const res = await create_mail_config(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加邮件配置成功！');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      }
    },
    async setDefault(value, row,index) {
      this.$Modal.confirm({
        title: `设置默认`,
        loading: true,
        content: `<p>是否设该邮件为默认</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await default_mail_config(row.id);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`设置成功`);
            this.$Modal.remove();
            this.getData();
          } else {
            if (value ) {
              row.isDefault = false;
            }
            this.data.splice(index,1,row);        
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value ) {
              row.isDefault = false;
            }
          this.data.splice(index,1,row);        
        },
      });
    },
    async setStatus(value, row, index) {
      this.$Modal.confirm({
        title: `发布状态`,
        loading: true,
        content: `<p>是否发布？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          if(value === 1){
            row.status = 1;
          }else{
            row.status = 2;
          }
          const res = await set_state_mail_config(row.id,row.status);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`设置成功`);
            this.$Modal.remove();
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
    async getData() {
      const query = {
        sendEmail:this.query.sendEmail,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      }
      this.loading = true;
      const res = await get_mail_config_list(this.page, this.limit, query);
      this.loading = false;
      if (res.status === 200) {
        this.data = res.data.itemList;
        this.total = res.data.itemTotal;
        const max_defalut = Math.max.apply(
          Math,
          this.data.map(function(o) {
            return o.default;
          }),
        );
        this.data.forEach(v => {
          if (v.default === max_defalut && max_defalut !== 0) {
            v.isDefault = true;
          } else {
            v.isDefault = false;
          }
        });
        
      }
    },
    getUserGroupAndMaxValue(arr) {
      const obj = {};
      arr.forEach(item => {
          if (obj[item.userName]) {
              obj[item.userName] =
              obj[item.userName] > item.default ? obj[item.userName] : item.default;
          } else {
              obj[item.userName] = item.default;
          }
          if(item.default == 0){
              delete obj[item.userName];
          }
      });
      return obj;
    },
    setIsDefault(group, arr) {
      return arr.map(item => {
          item.isDefault =
          item.default == 0 || (item.default != 0 && item.default == group[item.userName]) ? true : false;
        return item;
      });
    }
  },
};
</script>
