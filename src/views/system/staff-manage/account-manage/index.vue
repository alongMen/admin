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
        <template slot-scope="{ row,index}" slot="actions">
          
          <Button type="primary" size='small' @click="changePass(row)">修改密码</Button>&nbsp;
          <Button type="primary" size='small' @click="edit(row)">编辑</Button>
        </template>
        <template slot="isLock" slot-scope="{row,index}">
          <i-switch
            v-model="row.isLock"
            size='large'
            @on-change="value => setState(value, row)"
            :loading="btnLoading"
            :true-value="false"
            :false-value="true"
            v-if='row.registerSource>1'
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>&nbsp;
        </template>
        <template slot="lockTime" slot-scope="{row}">
          <span>{{formatBeijingDate(row.lockTime)}}</span>
        </template>
        <template slot="lastLoginTime" slot-scope="{row}">
          <span>{{formatBeijingDate(row.lastLoginTime)}}</span>
        </template>
      </Table>
      <div class="pagination">
        <Page :total="10" @on-change="pageChange" :current.sync="page" :page-size="limit"/>
      </div>
    </div>
    <Modal :title="title" v-model="showModal" :mask-closable="false">
      <Form ref="form" :model="form" :rules="rules">
        <FormItem label="账号" prop="userName">
          <Input v-model="form.userName" style="ime-mode:disabled"  :disabled="form.id !== undefined"></Input>
        </FormItem>
         <FormItem label="密码" prop="password" v-if="!form.id">
          <Input v-model="form.password"></Input>
        </FormItem>
        <FormItem label="角色" prop="roleId">
          <Select v-model="form.roleId">
            <Option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="email" prop="email">
          <Input v-model="form.email"></Input>
        </FormItem>
        <FormItem label="手机" prop="phone">
          <Input v-model="form.phone"></Input>
        </FormItem>
        <FormItem label="姓名" prop="fullName">
          <Input v-model="form.fullName"></Input>
        </FormItem>
        <FormItem label="部门名称" prop="deptName">
          <Input v-model="form.deptName"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Modal>

     <Modal :title="title" v-model="showModal1" :mask-closable="false">
      <Form ref="formpassword" :model="form" label-position="top" :rules="rules">
        <FormItem label="新密码" prop='newPassword'>
          <Input v-model="form.newPassword"></Input>
        </FormItem>
        <FormItem label="确认密码" prop='confirmPassword'>
          <Input v-model="form.confirmPassword"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="showModal1 = false" >取消</Button>
        <Button type="primary" :loading="btnLoading" @click="okChange">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import mixin from "@/mixins/single-form-mixin";
import {
  get_staff_list,
  create_staff,
  get_role_list,
  set_state_staff,
  change_staff_password,
  update_staff
} from "@/service/index";
import { cloneDeep } from "lodash";
import {validUserName, validMobileNoRequired} from '@/utils/validate';
export default {
  name: 'account-manage',
  mixins: [mixin],
  data() {
    const validRepassword = (rule, value, cb) => {
      if (this.form.newPassword && value !== this.form.newPassword) {
        cb(new Error("两次密码不同"));
      } else {
        cb();
      }
    };
    return {
      columns: [
        {
          title: "用户名",
          key: "userName"
        },
        {
          title: "姓名",
          key: "fullName"
        },
        {
          title: "手机",
          key: "phone"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "部门",
          key: "deptName"
        },
        {
          title: "角色",
          key: "roleName"
        },
        {
          title: "锁定",
          slot: "isLock"
        },
        {
          title: "锁定时间",
          slot: "lockTime"
        },
        {
          title: "上次登录时间",
          slot: "lastLoginTime"
        },
        {
          title: "上次登录IP",
          key: "lastLoginIP"
        },
        {
          title: '操作',
          slot: 'actions',
          width:150
        },
      ],
      showModal1:false,
      title: "添加员工",
      form: {},
      roleList: [],
      rules: {
        userName: [
          { required: true, trigger: "blur" },
          { validator: validUserName, trigger: 'blur' }
        ],
        email: [
          // { required: true, message: "请输入email", trigger: "blur" },
          { type: "email", message: "请输入正确格式email", trigger: "blur" }
        ],
        phone: [
          { validator:validMobileNoRequired, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        roleId: [
          {
            required: true,
            message: "请选择角色",
            type: "number",
            trigger: "change"
          }
        ],
        newPassword: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        confirmPassword: [
          { validator: validRepassword, trigger: 'blur' }
        ],
      }
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
          type: 'text',
          label: '用户名',
          field: 'userName'
        },
        {
          type: 'text',
          label: '姓名',
          field: 'fullName'
        },
      ];
    },
    moreForm() {
      return [
        {
          type: 'text',
          label: 'email',
          field: 'email'
        },
        {
          type: 'text',
          label: '手机',
          field: 'phone'
        },
      ];
    },
  },
  methods: {
    changePass(row){
      this.showModal1 = true
      this.form = {}
      this.id = row.id
    },
    // changeCode() {
    //   this.$nextTick(() => {
    //     if(this.form.userName !== null){
    //       this.form.userName = this.form.userName.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'')
    //     }
    //   })
    // },
    async okChange(){
      const valid = await this.$refs.formpassword.validate();
      if (!valid) return;
      this.btnLoading = true
      const res = await change_staff_password(this.id,this.form)
      this.btnLoading = false
      if(res.status<400){
        this.showModal1 = false
        this.$Message.success(`修改成功`);
      }
    },
    //
    edit(row) {
      this.form = cloneDeep(row);
      this.title = "修改员工";
      this.showModal = true;
    },
    //
    add() {
      this.title = "添加员工";
      this.form = {};
      this.showModal = true;
    },
    async ok() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        this.btnLoading = true;
        if (this.form.id) {
          const res = await update_staff(this.form.id, this.form);
          if (res.status < 400) {
            this.$Message.success("修改员工成功！");
            this.showModal = false;
          }
        } else {
          const res = await create_staff(this.form);
          if (res.status < 400) {
            this.$Message.success("添加员工成功！");
            this.showModal = false;
          }
        }
        this.btnLoading = false;
        this.getData();
      }
    },
    async setState(value,row,index){
      let state
      let title
      if(value){
        state = 2
        title = '关闭'
      }else{
        state = 1
        title = '开启'
      }
      this.$Modal.confirm({
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该员工：${row.userName}</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_state_staff(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}员工成功`);
            this.$Modal.remove();
          } else {
            if (value) {
              row.isLock = false;
            } else {
              row.isLock = true;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value) {
            row.isLock = false;
          } else {
            row.isLock = true;
          }
          this.data.splice(index,1,row);
        }
      });
    },
   
    //
    async getData() {
      const query = {
        userName:this.query.userName,
        fullName:this.query.fullName,
        email:this.query.email,
        phone:this.query.phone,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      }
      this.loading = true;
      const res = await get_staff_list(this.page, this.limit,query);
      this.loading = false;
      if (res.status === 200) {
        const data = res.data;
        this.data = data.itemList;
        this.total = data.itemTotal;
      }
    },
    //
    async getRoleList() {
      const res = await get_role_list();
      if (res.status === 200) {
        this.roleList = res.data;
      }
    }
  },
  mounted() {
    this.getData();
    this.getRoleList();
  }
};
</script>
