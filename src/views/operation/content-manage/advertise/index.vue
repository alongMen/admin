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
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>&nbsp;&nbsp;
          <Button type="error" @click="remove(row)">删除</Button>
        </template>

         <template slot-scope="{ row }" slot="imageUrl">
          <img :src="row.imageUrl" width='50' height='50' v-if='row.imageUrl'></img>
        </template>
        <template slot-scope="{ row }" slot="link">
          <a :href="row.link">{{ row.link }}</a>
        </template>

        <template slot="advertisementType" slot-scope="{ row }">
          <span v-if='row.advertisementType===1'>首页</span>
        </template>

        <template slot="siteType" slot-scope="{ row }">
           <span v-if='row.siteType===3'>PC</span>
          <span v-if='row.siteType===4'>WAP</span>
          <span v-if='row.siteType===5'>Andriod</span>
          <span v-if='row.siteType===6'>IOS</span>
        </template>

        <template slot="isExtend" slot-scope="{ row }">
          <Tag color='green' v-if='row.isExtend'>是</Tag>
          <Tag color='red' v-else>否</Tag>
        </template>

        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }}</span>
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
    <Drawer
      :title="title"
      v-model="showModal"
      width="70"
    >
      <Form :label-width="100" :model='form' :rules="rules" ref="form" v-if='showModal'>
        <Row :gutter="20" >
          <Col :span="12">
            <FormItem label="标题" prop="title">
              <Input v-model="form.title"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="图片" prop="imageUrl">
              <upload-button v-model="form.imageUrl" :accept='"image/*"'/>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="链接" prop="link">
              <Input v-model="form.link"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="广告类型" prop='advertisementType'>
              <Select v-model="form.advertisementType" >
                <Option v-for="item in advertisementType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
           <Col :span="12">
            <FormItem label="站点类型" prop='siteType'>
              <Select v-model="form.siteType"  >
                <Option label="PC" :value="3"> </Option>
                <Option label="WAP" :value="4"> </Option>
                <Option label="Andriod" :value="5"> </Option>
                <Option label="IOS" :value="6"> </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="8">
            <FormItem label="排序" prop="sortCode">
              <InputNumber v-model="form.sortCode"></InputNumber>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="等级" prop="gradeId">
              <InputNumber v-model="form.gradeId"></InputNumber>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="是否外链打开" prop="isExtend">
              <i-switch v-model="form.isExtend" size="large">
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
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import uploadButton from "@/components/upload-button/index";
import {siteType,advertisementType} from '@/config/enum'
import {validUrl} from '@/utils/validate';
import {
  get_advertise_list,
  create_advertise,
  update_advertise,
  remove_advertise,
} from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  name: 'advertise',
  mixins: [mixin],
  components:{
    uploadButton
  },
  data() {
    return {
      siteType,
      advertisementType,
      data: [],
      columns: [
        {
          title: '标题',
          key: 'title',
        },
        {
          title: '封面',
          slot: 'imageUrl',
        },
        {
          title: '链接',
          key: 'link',
          slot: 'link',
        },
        {
          title: '广告类型',
          slot: 'advertisementType',
        },
        {
          title: '站点类型',
          slot: 'siteType',
        },
        {
          title: '排序',
          key: 'sortCode',
        },
        {
          title: '是否外链接',
          slot: 'isExtend',
        },
        {
          title: '创建时间',
          slot: 'createTime',
        },
        {
          title: '等级',
          key: 'gradeId',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 180,
        },
      ],
      rules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        link: [{ required: true, message: '请填写外链', trigger: 'blur' },{ validator:validUrl, trigger: "blur" }],
        advertisementType: [{ required: true,type:'number', message: '请选择类型', trigger: 'change' }],
        siteType: [{ required: true,type:'number', message: '请选择站点类型', trigger: 'change' }],
        imageUrl: [{ required: true, message: '请上传封面'}],
      },
      title: '',
      form: {},
      query: {},
      upperDateOption: {
        disabledDate(date) {
          return date.valueOf() < Date.now() - 86400000;
        },
      },
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
          type: 'select',
          label: '用户类型',
          options: advertisementType,
          field: 'advertisementType'
        },
        {
          type: 'select',
          label: '站点类型',
          options: siteType,
          field: 'siteType'
        },
      ];
    },
    moreForm() {
      return []
    }
  },
  methods: {
    remove(row) {
      const id = row.id;
      this.$Modal.confirm({
        title: '删除广告',
        content: '<p>确定删除广告?</p>',
        loading: true,
        onOk: async () => {
          const res = await remove_advertise(id);
          this.$Modal.remove();
          if (res.status < 400) {
            this.$Message.success('删除广告成功！');
            this.page = 1;
            this.getData();
          }
        },
      });
    },
    //
    add() {
      this.title = '添加广告';
      this.form = {};
      this.showModal = true;
    },
    //
    edit(row) {
      this.title = '修改广告';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    //
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      if (this.form.id) {
        this.btnLoading = true;
        const res = await update_advertise(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('修改广告成功!');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      } else {
        this.btnLoading = true;
        const res = await create_advertise(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加广告成功！');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      }
    },

    async getData() {
      const query = {
        siteType:this.query.siteType,
        advertisementType:this.query.advertisementType,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      }
      this.loading = true;
      const res = await get_advertise_list(this.page, this.limit, query);
      this.loading = false;
      if (res.status === 200) {
        const data = res.data;
        this.data = data.itemList;
        this.total = data.itemTotal;
      }
    },
  },
};
</script>
