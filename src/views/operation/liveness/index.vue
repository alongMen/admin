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
        <Button type="primary" :loading="btnLoading" @click="oks">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_BLiveness_list_page,
  add_BLiveness_list_page,
  edit_BLiveness_list_page,
  del_BLiveness_list_page,
} from '@/service/index';
import { cloneDeep } from 'lodash';
import EditForm from './components/edit-form';
export default {
  name: 'liveness',
  mixins: [mixin],
  components: {
    EditForm,
  },
  data() {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
        },
        {
          title: '活跃度',
          key: 'fullAmount',
        },
        {
          title: '红包',
          key: 'amount',
        },
        {
          title: '积分',
          key: 'integration',
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
          label: '名称',
          type: 'text',
          field: 'name',
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
      this.title = '添加活跃度';
      this.showModal = true;
      this.form = {
        fullAmount: 5,
        amount: 0,
        integration: 0,
      };
    },
    edit(row) {
      this.title = '编辑活跃度';
      this.form = cloneDeep(row);
      this.showModal = true;
    },
    async oks() {
      // console.log(this.form);
      if (this.form.id) {
        const res = await edit_BLiveness_list_page(this.form.id, this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('更新活跃度成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.success(res);
        }
      } else {
        const res = await add_BLiveness_list_page(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加活跃度成功');
          this.showModal = false;
          this.getData();
        } else {
          this.$Message.success(res);
        }
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除',
        loading: true,
        content: '<p>是否删除该活跃度</p>',
        onOk: async () => {
          const res = await del_BLiveness_list_page(row.id);
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
    async getData() {
      this.loading = true;
      const query = {
        name: this.query.name,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      };

      const res = await get_BLiveness_list_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
};
</script>
