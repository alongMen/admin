<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="[]"
      v-model="query"
    />
    <!-- <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div> -->
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="logo">
          <img width='50' height='50' :src='row.logo' v-if='row.logo'></img>
        </template>
        <template slot-scope="{ row }" slot="isOnline">
          <Tag :color="row.isOnline?'green':'red'" >
            {{row.isOnline?'是':'否'}}
          </Tag>
        </template>
        <template slot-scope="{ row }" slot="registerSource">
          <span v-if='row.registerSource ===1 '>总管理后台</span>
          <span v-if='row.registerSource ===2 '>商户管理后台</span>
          <span v-if='row.registerSource ===3 '>PC端网站</span>
          <span v-if='row.registerSource ===4 '>手机端H5</span>
          <span v-if='row.registerSource ===5 '>手机端安卓APP</span>
          <span v-if='row.registerSource ===6 '>手机端IOSAPP</span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
            {{formatBeijingDate(row.createTime)}}
        </template>
        <template slot-scope="{ row,index }" slot="actions">
          <i-switch
            v-model="row.memberStatus"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>&nbsp;
          <Button type="primary" size='small' @click="remark(row)">备注</Button>&nbsp;
          <Button type="success" size='small' @click="changePass(row)">修改密码</Button>&nbsp;
          <Button type="info" size='small' @click="changePayPass(row)">修改支付密码</Button>
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
    <Modal
      :title="title"
      v-model="isChangePass"
      :mask-closable="false"
    >
      <Form ref="formpassword" :model="form" :rules="rules" :label-width="150">
        <FormItem label="密码：" prop="newPayPassword" v-if="type == 1">
          <Input
            v-model="form.newPayPassword"
            type="password"
            placeholder="密码"
            clearable
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="确认密码：" prop="confirmPayPassword" v-if="type == 1">
          <Input
            v-model="form.confirmPayPassword"
            type="password"
            placeholder="确认密码"
            clearable
            style="width: 200px"
          />
        </FormItem>
         <FormItem label="密码：" prop="newPassword" v-if="type == 2">
          <Input
            v-model="form.newPassword"
            type="password"
            placeholder="密码"
            clearable
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="确认密码：" prop="confirmPassword" v-if="type == 2">
          <Input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            clearable
            style="width: 200px"
          />
        </FormItem>
      </Form>
      
      <div slot="footer">
        <Button @click="isChangePass = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="changepwdOK">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="changepwd"
      title="提示："
      @on-ok="changepwdOks"
      @on-cancel="cancel"
    >
      <p>确认修改？</p>
    </Modal>

    
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {memberType} from '@/config/enum'
import {
  get_member_page,
  create_member,
  remark_member,
  set_state_member,
  create_balance_adjust,
  set_member_pass,
  set_member_paypass

} from '@/service/index';
export default {
  name: 'member-list',
  mixins: [mixin],
  data() {
    const validRepassword = (rule, value, cb) => {
      if (this.form.confirmPassword && value !== this.form.newPassword) {
        cb(new Error("两次密码不同"));
      } else {
        cb();
      }
    };
    const validRepaypassword = (rule, value, cb) => {
      if (this.form.confirmPayPassword && value !== this.form.newPayPassword) {
        cb(new Error("两次密码不同"));
      } else {
        cb();
      }
    };
    return {
      type:0,
      changepwd:false,
      form:{},
      rules:{
        newPayPassword: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请填写新密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, validator: validRepassword, trigger: 'blur' },
        ],
        confirmPayPassword: [
          { required: true, validator: validRepaypassword, trigger: 'blur' },
        ],
      },
      title:'',
      isChangePass:false,
      columns: [
        {
          title: '头像',
          key: 'logo',
          slot:'logo'
        },
        {
          title: '用户名',
          key: 'userName',
        },
        {
          title: 'email',
          key: 'email',
        },
        {
          title: '会员等级',
          key: 'memberGradeName',
        },
        {
          title: '在线',
          slot:'isOnline'
        },
        {
          title: '注册来源',
          slot:'registerSource'
        },
        {
          title: '备注',
          key: 'memberRemark',
        },
        {
          title: '创建时间',
          key: 'createTime',
          slot:'createTime'
        },
        {
          title: '操作',
          slot: 'actions',
          width:300
        },
      ],
    };
  },

  computed: {
    defaultForm() {
      return [
        {
          type: 'text',
          label: '用户名',
          field: 'userName'
        },
        {
          type: 'text',
          label: 'email',
          field: 'email'
        },
      ];
    },
  },
  methods: {
    changepwdOK(){
      this.changepwd = true;
    },
    async changepwdOks(){
      if(this.type == 1){
        let query = {
          newPayPassword :this.form.newPayPassword,
          confirmPayPassword :this.form.confirmPayPassword
        }
        const res = await set_member_paypass(this.form.id,query);
        if(res.status<400){
          this.$Message.success(`修改支付密码成功`);
          this.form ={}
          this.title = ''
          this.changepwd = false
          this.isChangePass = false;
          return false;
        }
      }else if(this.type == 2){
        let query = {
          newPassword :this.form.newPassword,
          confirmPassword :this.form.confirmPassword
        }
        const res = await set_member_pass(this.form.id,query);
        if(res.status<400){
          this.$Message.success(`修改登录密码成功`);
          this.form ={}
          this.title = ''
          this.changepwd = false
          this.isChangePass = false;
          return false;
        }
      }
    },
    cancel(){
      this.changepwd = false;
      this.form = {};
      this.isChangePass = false;
    },
    changePass(row){
      this.type = 2;
      this.isChangePass = true;
      this.form = {};
      this.form.id = row.id;
      this.title = '修改登录密码'
    },
    changePayPass(row){
      this.type = 1;
      this.isChangePass = true;
      this.form = {};
      this.form.id= row.id;
      this.title = '修改支付密码'
    },
    remark(row) {
      let remark = row.remark;
      this.$Modal.confirm({
        title: "设置用户备注",
        render: h => {
          return h("Input", {
            loading: true,
            props: {
              value: remark,
              autofocus: true,
              placeholder: "请输入备注",
              require: true
            },
            on: {
              input: val => {
                remark = val;
              }
            }
          });
        },
        onOk: async () => {
          if (remark) {
            const param = {
              remark: remark
            };
            const res = await remark_member(row.id,param);
            if (res.status < 400) {
              this.$Message.success(`备注成功`);
              this.getData()
            } else {
              this.$Modal.remove();
            }
          } else {
            this.$Message.error(`请填写用户：【${row.userName}】的备注`);
          }
        }
      });
    },
    
    async setState(value,row,index){
      let state
      let title
      if(value ===1){
        state = 1
        title = '开启'
      }else{
        state = 2
         title = '关闭'
      }
      this.$Modal.confirm({
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该用户：${row.userName}</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_state_member(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}用户成功`);
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
        }
      });
    },
    async getData() {
      this.loading = true;
      const query = {
        userName:this.query.userName,
        email:this.query.email,
        // begTime: this.query.date[0],
        // endTime: this.query.date[1],
      }
      const res = await get_member_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
  
};
</script>
