<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">

      </Table>
    </div>
       
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_Activity_sheet
} from '@/service/index';
export default {
  name: 'advertise',
  mixins: [mixin],
  data() {
    return {
      data: [],
      columns: [
        {
          title: '活动标题',
          key: 'activityTitle',
        },
        {
          title: '奖励积分',
          key: 'rewardIntegration',
        },
        {
          title: '奖励积分2',
          key: 'rewardAmount',
        },
        {
          title: '参与活动人数',
          key: 'numberOfParticipants',
        },
        {
          title: '已领取积分数',
          key: 'receivedIntegration',
        },
        {
          title: '已领取金额',
          key: 'receivedAmount',
        },
      ],
      form: {},
      query: {},
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
          label: '活动类型',
          options: [
            { value: 1, label: '注册' },
            { value: 2, label: '充值' },
            { value: 3, label: '推广' },
          ],
          field: 'ActivityType',
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
      let query = {
        ActivityType:this.query.ActivityType,
      }
      if(this.query.date[0]!==""){
        query.startTime = this.query.date[0];
        query.endTime = this.query.date[1];
      }
      this.loading = true;
      const res = await get_Activity_sheet(query);
      this.loading = false;
      // console.log(res)
      if (res.status === 200) {
        const data = res.data;
        this.data = data
      }
    },
  },
};
</script>
