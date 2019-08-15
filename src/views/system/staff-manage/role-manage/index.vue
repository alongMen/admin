<template>
  <div class="main-area">
    <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div>

    <div class="table-area">
      <Table :data="data" :columns="columns" :loading="loading">
        <template slot="actions" slot-scope="{ row }">
          <Button type="primary" @click="edit(row)">编辑</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" v-if="!row.isDefault" @click="editPermission(row)">权限</Button>
        </template>
      </Table>
    </div>

    <Modal :title="title" v-model="showModal" :mask-closable="false">
      <Form ref="form" :model="form" :rules="rules">
        <FormItem label="角色名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="code" prop="code">
          <Input v-model="form.code"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="roleOk"
          >确定</Button
        >
      </div>
    </Modal>

    <Drawer
      :title="title"
      width="90"
      v-model="showAside"
    >
      <role-form
        :permissionList="permissionList"
        v-if="showAside"
        :id="id"
        ref="roleForm"
      />
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="showAside = false"
          >取消</Button
        >
        <Button
          type="primary"
          @click="confirmSetPermission"
          :loading="btnLoading"
          >确定</Button
        >
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  get_all_permission_list,
  get_role_list,
  update_role,
  create_role,
  set_role_permission,
} from '@/service/index';
import RoleForm from './components/role-form';
import { cloneDeep } from 'lodash';
export default {
  components: {
    RoleForm,
  },
  data() {
    return {
      data: [],
      showAside: false,
      title: '',

      permissionList: [],
      form: {},
      btnLoading: false,
      showModal: false,
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色code', trigger: 'blur' }],
      },
      loading: false,
      columns: [
        {
          title: '角色名称',
          key: 'name',
        },
        {
          title: 'code',
          key: 'code',
        },
        {
          title: '操作',
          slot: 'actions',
        },
      ],

      id: 0,
    };
  },
  methods: {
    //
    async confirmSetPermission() {
      const roleForm = this.$refs.roleForm;
      const seleted = [];
      getSelectedItem(seleted, roleForm.data);
      this.btnLoading = true;
      const data = {
        roleId: this.id,
        permissionIds: seleted,
      };
      const res = await set_role_permission(data);
      this.btnLoading = false;
      if (res.status < 400) {
        this.showAside = false;
        this.$Message.success('设置权限成功!');
      }
    },
    //
    editPermission(row) {
      this.id = row.id;
      this.title = '编辑权限';
      this.showAside = true;
    },
    //
    edit(row) {
      this.form = cloneDeep(row);
      this.title = '编辑角色';
      this.showModal = true;
    },
    add() {
      this.form = {};
      this.title = '添加角色';
      this.showModal = true;
    },
    async get_all_permission_list() {
      const res = await get_all_permission_list();
      if (res.status < 400) {
        this.permissionList = res.data;
        // this.permissionList = res.data;
        // let result = [];
        // getTreedata(result,res.data);
        // this.permissionList = result;
      }
    },
    //
    async roleOk() {
      const valid = await this.$refs.form.validate;
      if (valid) {
        this.btnLoading = true;
        if (this.form.id) {
          const res = await update_role(this.form.id, this.form);
          this.btnLoading = false;
          if (res.status < 400) {
            this.showModal = false;
            this.$Message.success('角色修改成功!');
            this.getData();
          }
        } else {
          const res = await create_role(this.form);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success('角色添加成功');
            this.showModal = false;
            this.getData();
          }
        }
      }
    },
    //
    async getData() {
      this.loading = true;
      const res = await get_role_list();
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data;
      }
    },
  },
  mounted() {
    this.get_all_permission_list();
    this.getData();
  },
};

const getTreedata = (result, treeList) => {
  if (result.length === 0) {
    treeList.forEach(value => {
      if (value.parentId === 0) {
        result.push({ ...value, children: [], ok: true });
      }
    });
    if (result.length === 0) {
      return;
    }
    getTreedata(result, treeList);
  } else {
    result.forEach(value => {
      value.children = [];
      treeList.forEach(v => {
        if (value.id === v.parentId) {
          value.children.push({ ...v, ok: true });
          getTreedata(value.children, treeList);
        }
      });
    });
  }
};

const getSelectedItem = (result, data) => {
  data.forEach(value => {
    if (value.isSelect) {
      result.push(value.id);
    }
    if (value.children) {
      getSelectedItem(result, value.children);
    }
  });
};
</script>
