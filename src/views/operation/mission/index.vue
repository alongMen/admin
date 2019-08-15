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
        <template slot-scope="{ row }" slot="missionType">
          <span v-if="row.missionType == 1">推广</span>
          <span v-if="row.missionType == 2">充值</span>
          <span v-if="row.missionType == 3">流水</span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{ formatBeijingDate(row.createTime) }} </span>
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
  get_Mission_list_page,
  add_Mission_list_page,
  del_Mission_list_page,
  edit_Mission_list_page,
  state_Mission_list_page,
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
          title: '内容',
          key: 'description',
        },
        {
          title: '任务类型',
          slot: 'missionType',
        },
        {
          title: '创建时间',
          slot: 'createTime',
          // width: 150
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 240,
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
          label: '内容',
          type: 'text',
          field: 'description',
        },
        {
          type: 'select',
          label: '任务类型',
          options: [
            { value: 1, label: '推广' },
            { value: 2, label: '充值' },
            { value: 3, label: '流水' },
          ],
          field: 'missionType',
        },
        {
          type: 'radioButton',
          label: '状态',
          options: [{ label: '开启', value: 1 }, { label: '关闭', value: 2 }],
          field: 'status',
        },
        {
          label: '时间段',
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
      this.title = '添加任务';
      this.showModal = true;
      this.form = {
        status: 2,
      };
    },
    edit(row) {
      this.title = '编辑任务';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    async ok() {
      if (this.form.id) {
        const res = await edit_Mission_list_page(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('更新任务成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.error(res);
        }
      } else {
        this.form.missionDetails = this.$refs.form.ladder;
        const res = await add_Mission_list_page(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加任务成功');
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
        content: '<p>是否删除该任务</p>',
        onOk: async () => {
          const res = await del_Mission_list_page(row.id);
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
        content: `<p>是否${title}该任务</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await state_Mission_list_page(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}任务成功`);
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
        description: this.query.description,
        title: this.query.title,
        missionType: this.query.missionType,
        status: this.query.status,
        startTime: this.query.date[0],
        endTime: this.query.date[1],
      };
      const res = await get_Mission_list_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
};
</script>
