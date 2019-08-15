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
        <template slot-scope="{ row }" slot="newsType">
          <span v-if='row.newsType===1'>公告</span>
          <span v-if='row.newsType===2'>关于我们</span>
          <span v-if='row.newsType===3'>注册协议</span>
          <span v-if='row.newsType===4'>会员权益</span>
          <span v-if='row.newsType===5'>隐私政策</span>
          <span v-if='row.newsType===6'>免责声明</span>
        </template>
        <template slot-scope="{ row }" slot="modifyTime">
          <span>{{ formatBeijingDate(row.modifyTime) }}</span>
        </template>
        <template slot-scope="{ row }" slot="isPublish">
          <i-switch
            v-model="row.isPublish"
            size="large"
            @on-change="value => pub(value, row)"
            :loading="btnLoading"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>
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
    <Drawer :title="title" v-model="showModal" width="70" >
      <Form ref="form" :model="form" label-position="top" :rules="rules">
        <FormItem label="标题" prop='title'>
          <Input v-model="form.title"></Input>
        </FormItem>
        <FormItem label="简介">
          <Input v-model="form.summary"></Input>
        </FormItem>
        <FormItem label="内容" prop='description'>
          <editor v-model="form.description" :initContent="initContent" />
        </FormItem>
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="showModal = false"
          >取消</Button
        >
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import editor from '@/components/editor/index';
import newsType from '@/config/enum'
import {
  get_news_list,
  create_news_list,
  update_news_list,
  publish_news,
  get_news_detail,
} from '@/service/index';
export default {
  components: {
    editor,
  },
  name: 'board-manage',
  mixins: [mixin],
  data() {
    return {
      data: [],
      initContent: '',
      columns: [
        {
          title: '标题',
          key: 'title',
        },
        {
          title: '简介',
          key: 'summary',
        },
        {
          title: '是否上架',
          key: 'isPublish',
          slot: 'isPublish',
        },
        {
          title: '类型',
          key: 'newsType',
          slot: 'newsType',
        },
        {
          title: '修改时间',
          key: 'modifyTime',
          slot: 'modifyTime',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 180,
        },
      ],
      rules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        description: [{ required: true, message: '请填写内容', trigger: 'blur' }],
      },
      title: '添加公告',
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
    add() {
      this.form = {};
      this.title = '添加公告';
      this.initContent = ''
      this.showModal = true;
    },
    async edit(row) {
      this.title = '编辑公告';
      this.showModal = true;
      const res = await get_news_detail(row.id);
      if (res.status < 400) {
        this.form = res.data;
        this.form.id = row.id
        this.initContent = this.form.description
      }
    },
    async pub(value, row) {
      this.$Modal.confirm({
        title: '发布公告',
        loading: true,
        content: '<p>是否发布该公告</p>',
        onOk: async () => {
          const res = await publish_news(row.id);
          if (res.status < 400) {
            this.$Message.success('发布成功');
            this.$Modal.remove();
            this.getData();
          } else {
            this.$Modal.remove();
          }
        },
      });
    },
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.btnLoading = true;
      if (this.form.id) {
        const res = await update_news_list(this.form.id,this.form);
        if (res.status < 400) {
          this.$Message.success('修改公告成功');
        }
      } else {
        const res = await create_news_list(this.form);
        if (res.status < 400) {
          this.$Message.success('添加公告成功');
        }
      }
      this.btnLoading = false;
      this.showModal = false;
      this.page = 1;
      this.getData();
    },

    async getData() {
      this.loading = true;
      const res = await get_news_list(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data.itemList;
        this.total = res.data.itemTotal;
      }
    },
  },
};
</script>
