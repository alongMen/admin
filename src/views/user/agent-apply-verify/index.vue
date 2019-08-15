<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="[]"
      v-model="query"
    />
    
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading='loading'>
        <template slot-scope="{ row }" slot="agentApplyStatus">
          <Tag v-if='row.agentApplyStatus===1' color='orange'>申请</Tag>
          <Tag v-if='row.agentApplyStatus===2' color='green'>成功</Tag>
          <Tag v-if='row.agentApplyStatus===3' color='red'>拒绝</Tag>
        </template>
        <template slot-scope="{ row }" slot="actions" v-if='row.agentApplyStatus===1'>
          <Button type="primary" @click="pass(row)">通过</Button>&nbsp;
          <Button type="error" @click="reject(row)">拒绝</Button>
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
   
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {agentApplyStatus} from '@/config/enum'
import {
  get_agent_apply_page,
  set_state_agent_apply,
} from '@/service/index';
export default {
  name: 'agent-apply-verify',
  mixins: [mixin],

  data() {
    return {
      columns: [
        {
          title: '用户名',
          key: 'userName',
        },
        {
          title: '状态',
          slot: 'agentApplyStatus',
        },
        {
          title: '会员等级',
          key: 'memberGradeName',
        },
        {
          title: '有效会数(人)',
          key: 'validMemberNumber',
        },
        {
          title: '总充值金额(元)',
          key: 'totalRecharge',
        },
        {
          title: '总消费金额(元)',
          key: 'totalConsume',
        },
        {
          title: '下线总流水',
          key: 'offlineTotalFlow',
        },
        {
          title: '操作',
          slot: 'actions',
          width:180
        },
      ],
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
          type: 'select',
          label: '状态',
          options: agentApplyStatus,
          field: 'agentApplyStatus'
        },
        {
          label: "时间段",
          type: "timeRange",
          field: "date"
        }
      ];
    },
  },
  methods: {
   
    
    pass(row,index){
      let remark;
      this.$Modal.confirm({
        title: `通过该用户：${row.userName}？`,
        render: h => {
          return h("Input", {
            loading: true,
            props: {
              value: remark,
              autofocus: true,
              placeholder: "请输入备注",
              require: true
            },
            on: {
              input: val => {
                remark = val;
              }
            }
          });
        },
        onOk: async () => {
          this.btnLoading=true
          const res = await set_state_agent_apply(row.id,2,remark);
          this.btnLoading=false
          if (res.status < 400) {
            this.$Message.success(`已通过`);
            row.agentApplyStatus = 2
            this.data.splice(index,1,row);
          } else {
            this.$Modal.remove();
          }
        }
      });
    },
    reject(row,index){
      let remark;
      this.$Modal.confirm({
        title: `拒绝该用户：${row.userName}？`,
        render: h => {
          return h("Input", {
            loading: true,
            props: {
              value: remark,
              autofocus: true,
              placeholder: "请输入备注",
              require: true
            },
            on: {
              input: val => {
                remark = val;
              }
            }
          });
        },
        onOk: async () => {
          this.btnLoading=true
          const res = await set_state_agent_apply(row.id,3,remark);
          this.btnLoading=false
          if (res.status < 400) {
            this.$Message.success(`已拒绝`);
            row.agentApplyStatus = 3
            this.data.splice(index,1,row);
          } else {
            this.$Modal.remove();
          }
        }
      });
    },
    async getData() {
      this.loading = true;
      const query = {
        name:this.query.name,
        agentApplyStatus:this.query.agentApplyStatus,
        begTime: this.query.date[0],
        endTime: this.query.date[1],
      }
      const res = await get_agent_apply_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
};
</script>
