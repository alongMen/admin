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
        <template slot-scope="{ row, index}" slot="actions">
          <Button type="primary" size='small' @click="edit( row )">编辑</Button>&nbsp;
          <Button type="error" size='small' @click="del( row, index )">删除</Button>
        </template>
      </Table>
      <div class="pagination">
        <Page :total="total" @on-change="pageChange" :current.sync="page" :page-size="limit"/>
      </div>
    </div>
    <Modal :title="title" v-model="showModal" :mask-closable="false">
      <Form ref="form" :model="form" :rules="rules">
        <FormItem label="名称" prop="name" v-if="!form.id">
          <Input v-model="form.name" ></Input>
        </FormItem>
         <FormItem label="IP地址" prop="ipAddress" >
          <Input v-model="form.ipAddress"></Input>
        </FormItem>
         <!-- <FormItem label="商户名称" prop="tenantId" v-if="!form.id">
          <Select v-model="form.tenantId" style="width:200px">
                <Option v-for="item in merchants" :value="item.id" :key="item.value">{{ item.name }}</Option>
            </Select>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import mixin from "@/mixins/single-form-mixin";
import {
  update_ip_setting,
  add_ip_setting,
  get_ip_setting,
  del_ip_setting,
  get_merchant_page
} from "@/service/index";
import { cloneDeep } from "lodash";
export default {
  name: 'account-manage',
  mixins: [mixin],
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "IP地址",
          key: "ipAddress"
        },
        {
          title: '操作',
          slot: 'actions',
          width:150
        },
      ],
      // merchants:[],
      showModal1:false,
      title: "添加",
      form: {},
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        ipAddress: [{ required: true, message: "请输入IP地址", trigger: "blur" }]
      }
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          type: 'text',
          label: '名称',
          field: 'name'
        },
        {
          type: 'text',
          label: 'IP地址',
          field: 'IPAddress'
        },
      ];
    },
    moreForm() {
      return [];
    },
  },
  methods: {
    async del(row,index){
        this.$Modal.confirm({
            title: '删除提示：',
            content: '是否删除？',
            onOk: async() => {
                const res = await del_ip_setting(row.id);
                if(res.status < 400){
                    this.$Message.info('删除成功');
                    this.data.splice(index,1);
                }
            },
            // onCancel: () => {
                
            // }
        });
    },
    //修改
    edit(row) {
      this.form = cloneDeep(row);
      this.title = "修改";
      this.showModal = true;
    },
    //添加
    add() {
      this.title = "添加";
      this.form = {};
      this.showModal = true;
    },
    async ok() {
        if (this.form.name && this.form.ipAddress) {
            this.btnLoading = true;
        if (this.form.id) {
            const res = await update_ip_setting(this.form.id, this.form);
          if (res.status < 400) {
              this.$Message.success("修改成功！");
            this.showModal = false;
          }
        } else {
          const res = await add_ip_setting(this.form);
          if (res.status < 400) {
            this.$Message.success("添加成功！");
            this.showModal = false;
          }
        }
        this.btnLoading = false;
        this.getData();
      }
    },
    async getData() {
      this.loading = true;
      const res = await get_ip_setting(this.page, this.limit,this.query);
      this.loading = false;
      if (res.status === 200) {
        const data = res.data;
        this.data = data.itemList;
        this.total = data.itemTotal;
      }
    },
    //获取商户信息
    // async getMerchant() {
    //   const res = await get_merchant_page(1,1000);
    //   if (res.status === 200) {
    //     console.log(res);
    //     if(res.data){
    //         this.merchants = res.data.itemList;
    //     }
    //   }
    // }
  },
  mounted() {
    this.getData();
    // this.getMerchant();
  }
};
</script>
