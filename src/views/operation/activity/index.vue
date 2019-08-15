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
        <template slot-scope="{ row }" slot="imageUrl">
          <img :src="row.imageUrl" alt="" width="20" height="20" />
        </template>
        <template slot-scope="{ row }" slot="detailImageUrl">
          <img :src="row.detailImageUrl" alt="" width="20" height="20" />
        </template>
        <template slot-scope="{ row }" slot="startTime">
          <span>{{ formatBeijingDate(row.startTime) }} </span>
        </template>
        <template slot-scope="{ row }" slot="endTime">
          <span>{{ formatBeijingDate(row.endTime) }} </span>
        </template>
        <template slot-scope="{ row }" slot="drawStartTime">
          <span>{{ formatBeijingDate(row.drawStartTime) }} </span>
        </template>
        <template slot-scope="{ row }" slot="drawEndTime">
          <span>{{ formatBeijingDate(row.drawEndTime) }} </span>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <i-switch
            v-model="row.status"
            :true-value="1"
            :false-value="2"
            size="large"
            @on-change="value => setState(value, row, index)"
            :loading="btnLoading"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="edit(row)">编辑</Button>&nbsp;
          <Button type="error" v-if="!row.isEdit" @click="del(row)"
            >删除</Button
          >
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
    <Drawer :title="title" v-model="showModal" width="70">
      <edit-form :form="form" v-if="showModal" ref="form" />
      <div class="drawer-footer">
        <Button @click="showModal = false" style="margin-right: 8px"
          >取消</Button
        >
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_activity_list_page,
  add_activity_list_page,
  del_activity_list_page,
  publish_activity_list_page,
  edit_activity_list_page,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import EditForm from './components/edit-form';
export default {
  name: 'charge-setting',
  mixins: [mixin],
  components: {
    EditForm,
  },
  data() {
    return {
      columns: [
        {
          title: '标题',
          key: 'title',
        },
        {
          title: '列表图片',
          slot: 'imageUrl',
        },
        {
          title: '内容图片',
          slot: 'detailImageUrl',
        },
        {
          title: '活动类型',
          key: 'activityTypeName',
        },
        {
          title: '活动开始时间',
          key: 'startTime',
          slot: 'startTime',
          width: 150,
        },
        {
          title: '活动结束时间',
          key: 'endTime',
          slot: 'endTime',
          width: 150,
        },
        {
          title: '领取开始时间',
          key: 'drawStartTime',
          slot: 'drawStartTime',
          width: 150,
        },
        {
          title: '领取结束时间',
          key: 'drawEndTime',
          slot: 'drawEndTime',
          width: 150,
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 180,
        },
      ],
      title: '',
      form: {},
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          label: '标题',
          type: 'text',
          field: 'title',
        },
        {
          type: 'select',
          label: '活动类型',
          options: [
            { value: 1, label: '注册' },
            { value: 2, label: '充值' },
            { value: 3, label: '推广' },
          ],
          field: 'activityType',
        },
        {
          label: '时间',
          field: 'date',
          type: 'timeRange',
        },
      ];
    },
    moreForm() {
      return [];
    },
  },
  methods: {
    add() {
      this.title = '添加活动';
      this.showModal = true;
      this.form = {
        status: 2,
      };
    },
    edit(row) {
      this.title = '编辑活动';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    async ok() {
      if (!this.form.title) {
        this.$Message.success('请填写活动标题！');
        return false;
      }
      if (!this.form.imageUrl) {
        this.$Message.success('请上传列表图片！');
        return false;
      }
      if (!this.form.detailImageUrl) {
        this.$Message.success('请上传内容图片！');
        return false;
      }
      if (this.form.id) {
        const res = await edit_activity_list_page(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('更新活动成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.error(res);
        }
      } else {
        this.form.activityDetails = this.$refs.form.ladder;
        const res = await add_activity_list_page(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加活动成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.error(res);
        }
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除',
        loading: true,
        content: '<p>是否删除该活动</p>',
        onOk: async () => {
          const res = await del_activity_list_page(row.id);
          if (res.status < 400) {
            this.$Message.success('删除成功');
            this.$Modal.remove();
            this.getData();
          } else {
            this.$Modal.remove();
          }
        },
      });
    },
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
        title: `${title}等级`,
        loading: true,
        content: `<p>是否${title}该活动</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await publish_activity_list_page(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}活动成功`);
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
    async getData() {
      this.loading = true;
      const query = {
        title: this.query.title,
        activityType: this.query.activityType,
        startTime: this.query.date[0],
        endTime: this.query.date[1],
      };
      const res = await get_activity_list_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
};
</script>
