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
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="logo">
          <img width='50' height='50' :src='row.logo' v-if='row.logo'></img>
        </template>
        <template slot-scope="{ row }" slot="isOnline">
          <Tag :color="row.isOnline?'green':'red'" >
            {{row.isOnline?'是':'否'}}
          </Tag>
        </template>
        <template slot-scope="{ row }" slot="registerSource">
          <span v-if='row.registerSource ===1 '>总管理后台</span>
          <span v-if='row.registerSource ===2 '>商户管理后台</span>
          <span v-if='row.registerSource ===3 '>PC端网站</span>
          <span v-if='row.registerSource ===4 '>手机端H5</span>
          <span v-if='row.registerSource ===5 '>手机端安卓APP</span>
          <span v-if='row.registerSource ===6 '>手机端IOSAPP</span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
            {{formatBeijingDate(row.createTime)}}
        </template>
        <template slot-scope="{ row,index }" slot="actions">
          <i-switch
            v-model="row.agentStatus"
            size="small"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>&nbsp;
          <Button type="primary" size='small' @click="remark(row)">备注</Button>
          
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
import {memberType} from '@/config/enum'
import {
  get_agent_page,
  remark_agent,
  set_state_agent,
} from '@/service/index';
export default {
  name: 'agent-list',
  mixins: [mixin],
  data() {
    return {
      columns: [
        {
          title: '头像',
          key: 'logo',
          slot:'logo'
        },
        {
          title: '用户名',
          key: 'userName',
        },
        {
          title: 'email',
          key: 'email',
        },
        // {
        //   title: '昵称',
        //   key: 'nickName',
        // },
        {
          title: '会员等级',
          key: 'memberGradeName',
        },
        {
          title: '代理等级',
          key: 'agentGradeName',
        },
        {
          title: '在线',
          slot:'isOnline'
        },
        {
          title: '注册来源',
          slot:'registerSource'
        },
        // {
        //   title: '最后登陆ip',
        //   key: 'lastLoginIP',
        // },
        {
          title: '备注',
          key: 'agentRemark',
        },
        {
          title: '创建时间',
          key: 'createTime',
          slot:'createTime'
        },
        {
          title: '操作',
          slot: 'actions',
          width:150
        },
      ],
    };
  },

  computed: {
    defaultForm() {
      return [
        {
          type: 'text',
          label: '用户名',
          field: 'userName'
        },
        {
          type: 'text',
          label: 'email',
          field: 'email'
        },
        // {
        //   type: 'text',
        //   label: '手机',
        //   field: 'phone'
        // },
      ];
    },
  },
  methods: {
    remark(row) {
      let remark = row.remark;
      this.$Modal.confirm({
        render: h => {
          return h("Input", {
            title: "设置用户备注",
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
          if (remark) {
            const param = {
              remark: remark
            };
            const res = await remark_agent(row.id,param);
            if (res.status < 400) {
              this.$Message.success(`备注成功`);
              this.getData()
            } else {
              this.$Modal.remove();
            }
          } else {
            this.$Message.error(`请填写用户：【${row.userName}】的备注`);
          }
        }
      });
    },
    async setState(value,row,index){
      let state
      let title
      if(value ===1){
        state = 1
        title = '开启'
      }else{
        state = 2
         title = '关闭'
      }
      this.$Modal.confirm({
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该代理</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_state_agent(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}代理成功`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value === 1) {
              row.status = 2;
            } else {
              row.status = 1;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value === 1) {
            row.status = 2;
          } else {
            row.status = 1;
          }
          this.data.splice(index,1,row);
        }
      });
    },
    async getData() {
      this.loading = true;
      const query = {
        userName:this.query.userName,
        email:this.query.email,
        // begTime: this.query.date[0],
        // endTime: this.query.date[1],
      }
      const res = await get_agent_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
};
</script>
