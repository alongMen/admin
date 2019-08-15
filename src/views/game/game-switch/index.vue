
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
        <template slot-scope="{ row,index }" slot="status">
          <i-switch
            v-model="row.status"
            size="large"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
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
import { get_game_page,set_state_game } from '@/service/index';
import { game_type,game_platform } from '@/config/enum';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "game-switch",
  mixins: [mixin],
  data(){
    return{
      game_type,
      game_platform,
      columns:[
        {
          title: '游戏类型',
          key: 'gameTypeName'
        },
        {
          title: '游戏平台',
          key: 'gamePlatformName'
        },
        {
          title: '游戏名称',
          key: 'name'
        },
        {
          title: '英文名',
          key: 'englishName'
        },
        {
          title: 'code',
          key: 'code'
        },
        {
          title: '状态',
          slot: 'status'
        },
      ],
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '游戏名称',
          type: 'text',
          field: 'gameName'
        },
        {
          type: 'select',
          label: '游戏类型',
          options: this.game_type,
          field: 'gameTypeId'
        },
        {
          type: 'select',
          label: '游戏平台',
          options: this.game_platform,
          field: 'gamePlatformId'
        },
      ]
    },
    moreForm(){
      return [
        {
          type: 'radioButton',
          label: '状态',
          options: [
            {label:'开启',value:1},
            {label:'关闭',value:2},
          ],
          field: 'status'
        },
      ]
    }
  },
  methods:{
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
        content: `<p>是否${title}该游戏</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_state_game(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}游戏成功`);
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
        },
      });
    },
    async getData() {
      this.loading = true;
      const res = await get_game_page(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  },
  mounted() {},
}
</script>