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
    <Alert type="warning"
      >发布pc和wap两个站点时，请间隔2分钟发布，以免新站点生成错误</Alert
    >
    <div class="table-area">
      <Table :data="data" :loading="loading" :columns="columns">
        <template slot="logo" slot-scope="{ row }">
          <img :src="row.logo" width="50" height="50" v-if="row.logo" />
        </template>
        <template slot="status" slot-scope="{ row, index }">
          <i-switch
            v-model="row.status"
            size="large"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row, index)"
            :loading="btnLoading"
            v-if="row.siteType > 2"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
          <Tag color="green" v-else>是</Tag>
        </template>
        <template slot="isPublish" slot-scope="{ row }">
          <Tag color="green" v-if="row.isPublish">是</Tag>
          <Tag color="red" v-else>否</Tag>
        </template>
        <template slot-scope="{ row }" slot="protocolType">
          <span v-if="row.protocolType === 1">http</span>
          <span v-if="row.protocolType === 2">https</span>
        </template>

        <template slot-scope="{ row }" slot="website">
          <a
            :href="row.website"
            ref="target"
            target="_blank"
            @click="test(row)"
            >{{ row.website }}</a
          >
        </template>

        <!-- <template slot-scope="{ row }" slot="createTime">
           {{formatBeijingDate(row.createTime)}}
        </template> -->

        <template slot-scope="{ row }" slot="siteType">
          <span v-if="row.siteType === 2">商户后台</span>
          <span v-if="row.siteType === 3">PC</span>
          <span v-if="row.siteType === 4">WAP</span>
          <span v-if="row.siteType === 5">Andriod</span>
          <span v-if="row.siteType === 6">IOS</span>
        </template>

        <template slot-scope="{ row, index }" slot="actions">
          <Button type="primary" @click="edit(row)" style="margin-right:5px;"
            >编辑</Button
          >
          <Button
            type="error"
            @click="del(row, index)"
            v-if="row.siteType !== 2"
            style="margin-right:5px;"
            >删除</Button
          >
          <Button
            type="warning"
            @click="publish(row, index)"
            v-if="!row.isPublish"
            style="margin-right:5px;"
            >发布</Button
          >
        </template>
      </Table>
    </div>
    <Drawer :title="title" v-model="showModal" width="70">
      <Form
        :label-width="100"
        :model="form"
        :rules="rules"
        ref="form"
        v-if="showModal"
      >
        <Row :gutter="20" v-if="form.siteType > 2 ">
          <Col :span="12">
            <FormItem label="网站名称" prop="websiteName">
              <Input v-model="form.websiteName"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="网站标题" prop="websiteTitle">
              <Input v-model="form.websiteTitle"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20" v-if="form.siteType > 2 && form.siteType < 5">
          <Col :span="12">
            <FormItem label="站点描述" prop="websiteDescription">
              <Input v-model="form.websiteDescription"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="站点关键字" prop="websiteKeyWord">
              <Input v-model="form.websiteKeyWord"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12" v-if="form.siteType === 3 || form.siteType === 2">
            <FormItem label="logo(尺寸：120*40)" prop="logo">
              <upload-button v-model="form.logo" :accept="'image/*'" />
            </FormItem>
          </Col>
          <Col :span="12" v-if="form.siteType === 3 || form.siteType === 4">
            <FormItem label="登陆logo(尺寸：72*72)" prop="loginLogo">
              <upload-button v-model="form.loginLogo" :accept="'image/*'" />
            </FormItem>
          </Col>
          <Col :span="12" v-if="form.siteType === 3">
            <FormItem label="注册图片(尺寸：300*628)" prop="registerLogo">
              <upload-button v-model="form.registerLogo" :accept="'image/*'" />
            </FormItem>
          </Col>
          <Col :span="12" v-if="form.siteType >= 2 && form.siteType <= 4">
            <FormItem label="网页标题logo(尺寸：32*32)" prop="otherLogo">
              <upload-button v-model="form.otherLogo" :accept="'image/*'" />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12" v-if="form.siteType > 2 || !form.id">
            <FormItem label="网站类型" prop="siteType">
              <Select v-model="form.siteType" :disabled="form.id > 0">
                <Option label="PC" :value="3"> </Option>
                <Option label="WAP" :value="4"> </Option>
                <Option label="Andriod" :value="5"> </Option>
                <Option label="IOS" :value="6"> </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12" v-if="form.siteType > 2 && form.siteType < 5">
            <FormItem label="网站协议" prop="protocolType">
              <Select v-model="form.protocolType">
                <Option label="http" :value="1"> </Option>
                <Option label="https" :value="2"> </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12" v-if="form.siteType > 2 && form.siteType < 5">
            <FormItem label="网站地址" prop="website">
              <Input
                placeholder="网站类型为PC，WAP时该项必填"
                v-model="form.website"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="12" v-if="form.siteType > 2">
            <FormItem label="客服地址" prop="serviceUrl">
              <Input v-model="form.serviceUrl"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20" v-if="form.siteType > 2">
          <Col :span="12">
            <FormItem label="开放普通注册" prop="isRegister">
              <i-switch v-model="form.isRegister">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="开放邮箱注册" prop="isMailRegister">
              <i-switch v-model="form.isMailRegister">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="开放手机注册" prop="isPhoneRegister">
              <i-switch v-model="form.isPhoneRegister">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>

        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="showModal = false"
            >取消</Button
          >
          <Button type="primary" @click="ok" :loading="btnLoading">确定</Button>
        </div>
      </Form>
    </Drawer>

    <!-- <Modal v-model="modal2" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>提示：</span>
        </p>
        <div style="text-align:center">
            <p>请确认网站地址填写完整！</p>
        </div>
        <div slot="footer">
            <Button type="warning" size="large" long :loading="modal_loading" @click="handleConfirm">确定</Button>
        </div>
    </Modal> -->
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import uploadButton from '@/components/upload-button/index';
import { validDomainNoRequired } from '@/utils/validate';
import {
  get_site_list,
  create_site,
  update_site,
  remove_site,
  switch_site,
  publish_site,
} from '@/service/index';
import { cloneDeep } from 'lodash';
const uuidv1 = require('uuid/v4');
export default {
  name: 'site-manage',
  mixins: [mixin],
  components: {
    uploadButton,
  },
  data() {
    return {
      modal_loading: false,
      modal2: false,
      title: '',
      form: {},
      rules: {
        websiteName: [
          { required: true, message: '请填写名称', trigger: 'blur' },
        ],
        websiteTitle: [
          { required: true, message: '请填写标题', trigger: 'blur' },
        ],
        protocolType: [
          {
            required: true,
            type: 'number',
            message: '请选择协议',
            trigger: 'change',
          },
        ],
        siteType: [
          {
            required: true,
            type: 'number',
            message: '请选择站点类型',
            trigger: 'change',
          },
        ],
        website: [
          { required: true, message: '请填写标题', trigger: 'blur' },
          { validator: validDomainNoRequired, trigger: 'blur' },
        ],
        startTime: [
          {
            required: true,
            type: 'date',
            message: '请填写开始时间',
            trigger: 'change',
          },
        ],
        endTime: [
          {
            required: true,
            type: 'date',
            message: '请填写结束时间',
            trigger: 'change',
          },
        ],
      },
      upperDateOption: {
        disabledDate(date) {
          return date.valueOf() < Date.now() - 86400000;
        },
      },
      columns: [
        {
          title: '站点名称',
          key: 'websiteName',
        },
        {
          title: '站点标题',
          key: 'websiteTitle',
        },
        {
          title: '站点描述',
          key: 'websiteDescription',
        },
        {
          title: 'logo',
          slot: 'logo',
        },
        {
          title: '协议',
          slot: 'protocolType',
        },
        {
          title: '地址',
          slot: 'website',
        },
        {
          title: '状态',
          slot: 'status',
        },
        {
          title: '发布',
          slot: 'isPublish',
        },
        {
          title: '站点类型',
          slot: 'siteType',
        },
        // {
        //   title: '创建时间',
        //   slot: 'createTime',
        //   width: 180
        // },
        {
          title: '操作',
          slot: 'actions',
          width: 180,
        },
      ],
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          type: 'text',
          label: '网址',
          field: 'website',
        },
        {
          type: 'text',
          label: '网站名称',
          field: 'websiteName',
        },
      ];
    },
    moreForm() {
      return [];
    },
  },
  methods: {
    async setState(value, row, index) {
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
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该站点：${row.website}</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await switch_site(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}用站点成功`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value === 1) {
              row.status = 2;
            } else {
              row.status = 1;
            }
            this.data.splice(index, 1, row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value === 1) {
            row.status = 2;
          } else {
            row.status = 1;
          }
          this.data.splice(index, 1, row);
        },
      });
    },
    add() {
      const appId = uuidv1();
      const appSecret = uuidv1();
      this.form = {
        appId: appId.replaceAll('-', ''),
        appSecret: appSecret.replaceAll('-', ''),
        scope: 'player',
      };
      this.title = '添加站点';
      this.showModal = true;
    },
    //
    edit(row) {
      this.form = cloneDeep(row);
      this.title = '编辑站点';
      this.showModal = true;
    },
    // change_status(){
    //   if(this.form.siteType == 3){
    //     if(!this.form.website){
    //       this.modal2 = true;
    //     }else{
    //       this.modal2 = false;
    //     }
    //   }
    // },
    // handleConfirm(){
    //   this.modal_loading = true;
    //   setTimeout(() => {
    //       this.modal_loading = false;
    //       this.modal2 = false;
    //   }, 500);

    // },
    async publish(row, index) {
      this.$Modal.confirm({
        title: `提示`,
        loading: true,
        content: `<p>是否发布？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await publish_site(row.id);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`发布成功！`);
            row.isPublish = true;
            this.data.splice(index, 1, row);
            this.$Modal.remove();
          } else {
            this.$Message.success(`发布失败！`);
            this.$Modal.remove();
          }
        },
      });
    },
    test(row) {
      window.open('http://' + row.website);
    },
    async del(row, index) {
      this.$Modal.confirm({
        title: `提示`,
        loading: true,
        content: `<p>是否删除？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await remove_site(row.id);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`删除成功！`);
            this.data.splice(index, 1);
            this.$Modal.remove();
          } else {
            this.$Message.success(`删除失败！`);
            this.$Modal.remove();
          }
        },
      });
    },
    //
    async getData() {
      const query = {
        website: this.query.website,
        websiteName: this.query.websiteName,
      };
      console.log(query);
      this.loading = true;
      const res = await get_site_list(this.page, this.limit, query);
      this.loading = false;
      if (res.status === 200) {
        const data = res.data;
        this.data = data.itemList;
        this.total = data.itemTotal;
      }
    },
    lowwerDateOption() {
      const self = this;
      return {
        disabledDate(date) {
          return date.valueOf() - 86400000 < self.form.upperShelfTime;
        },
      };
    },
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      if (this.form.websiteType == 3 && !this.form.website) return;
      if (this.form.id) {
        this.btnLoading = true;
        const res = await update_site(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('修改站点成功!');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      } else {
        this.btnLoading = true;
        const res = await create_site(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加站点成功！');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      }
    },
  },
};
</script>
