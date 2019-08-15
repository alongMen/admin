





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
        <template slot-scope="{ row }" slot="win">
          <Tag color='red' v-if='row.win===0'>{{row.win}}</Tag>
          <Tag color='green' v-else>{{row.win}}</Tag>
           
        </template>
        <template slot-scope="{ row }" slot="time">
           {{formatBeijingDate(row.time)}}
        </template>
        <template slot-scope="{ row }" slot="createTime">
           {{formatBeijingDate(row.createTime)}}
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
import { get_game_record_page } from '@/service/index';
import { game_type,game_platform } from '@/config/enum';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "game-record",
  mixins: [mixin],
  data(){
    return {
      game_type,
      game_platform,
      columns:[
        {
          title: '玩家名',
          key: 'playerName'
        },
        {
          title: '游戏名',
          key: 'gameName'
        },
        {
          title: '类型',
          key: 'gameTypeId'
        },
        {
          title: '平台',
          key: 'gamePlatformId'
        },
       
        {
          title: '下注(元)',
          key: 'validWager'
        },
        {
          title: '中奖(元)',
          slot: 'win'
        },
         {
          title: '返水(元)',
          key: 'amount'
        },
        {
          title: '返水结算时间',
          slot: 'time'
        },
        {
          title: '创建时间',
          slot: 'createTime'
        },
      ],
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '玩家名',
          type: 'text',
          field: 'playerName'
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
          label: '时间',
          field: 'date',
          type: 'timeRange',
        },
        {
          label: '游戏名',
          type: 'text',
          field: 'gameName'
        },
      ]
    }
  },
  methods:{
    async getData() {
      const query = {
        gameTypeId:this.query.gameTypeId,
        gamePlatformId:this.query.gamePlatformId,
        gameName:this.query.gameName,
        playerName:this.query.playerName,
        startTime: this.query.date[0],
        endTime: this.query.date[1]
      }
      this.loading = true;
      const res = await get_game_record_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
  }
  ,mounted() {

  },
}
</script>