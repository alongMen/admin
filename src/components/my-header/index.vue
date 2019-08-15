<template>
  <div class="my-header">
    <div class="signOut">
      <Dropdown @on-click="changeDate">
        <div class="outbtn">
          <Icon type="ios-contact" class="outicon" />
          <span class="outspan"
            >{{ username }} &nbsp;&nbsp;<Icon type="ios-arrow-down"></Icon
          ></span>
        </div>
        <DropdownMenu slot="list">
          <DropdownItem name="changePass">修改密码</DropdownItem>
          <DropdownItem name="signOut">注销登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <Modal v-model="isSignOut" title="提示：" @on-ok="ok" @on-cancel="cancel">
      <p>是否确认注销登录？</p>
    </Modal>

    <Modal
      title="修改当前用户密码"
      v-model="isChangePass"
      :mask-closable="false"
    >
      <Form ref="formpassword" :model="form" :rules="rules" :label-width="150">
        <FormItem label="旧密码：" prop="oldPassword">
          <Input
            v-model="form.oldPassword"
            type="password"
            placeholder="旧密码"
            clearable
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="新密码：" prop="newPassword">
          <Input
            v-model="form.newPassword"
            type="password"
            placeholder="新密码"
            clearable
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="确认新密码：" prop="confirmPassword">
          <Input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认新密码"
            clearable
            style="width: 200px"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isChangePass = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="changepwdOK"
          >确定</Button
        >
      </div>
    </Modal>
    <Modal
      v-model="changepwd"
      title="提示："
      @on-ok="changepwdOk"
      @on-cancel="cancel"
    >
      <p>确认修改？</p>
    </Modal>
  </div>
</template>
<script>
import { change_current_staff_password } from '@/service/index';
export default {
  data() {
    const validRepassword = (rule, value, cb) => {
      if (this.form.newPassword && value !== this.form.newPassword) {
        cb(new Error('两次密码不同'));
      } else {
        cb();
      }
    };
    return {
      username: '',
      isSignOut: false,
      isChangePass: false,
      changepwd: false,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      btnLoading: false,
      showModal: false,
      rules: {
        oldPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请填写密码', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, validator: validRepassword, trigger: 'blur' },
        ],
      },
      loading: false,
    };
  },
  mounted() {
    this.username = localStorage.getItem('userName') || '账号设置';
  },
  methods: {
    signOut(e) {
      e.preventDefault();
      this.isSignOut = true;
    },
    changeDate(name) {
      if (name === 'signOut') {
        this.isSignOut = true;
      } else if (name === 'changePass') {
        this.isChangePass = true;
      }
    },
    changepwdOK() {
      this.changepwd = true;
    },
    async changepwdOk() {
      const valid = await this.$refs.formpassword.validate();
      if (!valid) return;
      this.btnLoading = true;
      const res = await change_current_staff_password(this.form);
      this.btnLoading = false;
      if (res.status < 400) {
        this.changepwd = false;
        this.form.oldPassword = '';
        this.form.newPassword = '';
        this.form.confirmPassword = '';
        this.$Message.success(`修改成功`);
        this.isChangePass = false;
      }
    },
    ok() {
      localStorage.clear();
      // 跳转到登录页面
      this.$Message.info('退出登录成功！');
      this.$router.push('/login');
    },
    cancel() {
      this.isSignOut = false;
      this.changepwd = false;
      this.form.oldPassword = '';
      this.form.newPassword = '';
      this.form.confirmPassword = '';
    },
  },
};
</script>

<style lang="less">
.my-header {
  width: 100%;
  height: 60px;
  background-color: #fff;
  text-align: right;
  box-sizing: border-box;
  .signOut {
    width: 100%;
    height: 60px;
    padding-right: 150px;
    text-align: right;
    color: #3b69e2;
    line-height: 60px;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
    z-index: 100;
    .outbtn {
      cursor: pointer;
      .outicon {
        font-size: 24px;
      }
      .outspan {
        padding-left: 10px;
      }
    }
    .ivu-select-dropdown {
      top: 50px !important;
    }
  }
}
</style>
