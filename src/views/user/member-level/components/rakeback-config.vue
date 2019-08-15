<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="[]"
      v-model="query"
    />
    <div class="operation">
      <Button type="primary" @click="oneKeyEnable">一键开启</Button>
    </div>
    <div class="table-area">
      <Table :columns="columns" :data="data" :loading='loading' ref='selection' >
        <template slot-scope="{ row,index }" slot="status">
           <i-switch
            v-model="row.status"
            size="large"
            :true-value="1"
            :false-value="2"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
            v-if='row.id>0'
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <Button type="primary" @click="setting(row)">返水设置</Button>
        </template>
      </Table>
    </div>
    <Modal title="返水设置" v-model="showModal" :mask-closable="false">
      <Form  label-position="top" >
        <FormItem label="单次限额(0为无上限)" >
          <Input-number v-model="singleLimit.singleLimit" :min="0"></Input-number>元
        </FormItem>
        <FormItem label="阶梯返水设置" >
          <Button type="primary" @click="addLadder">添加设置</Button>
          <Table :data="ladder"     :columns="ladderColumns"  :loading='loading'  >
            <template slot-scope="{ row }" slot="flowConsume">
              <Input-number  :min="0" v-model="row.flowConsume" v-if="row.isEdit"></Input-number>
              <span v-else>{{row.flowConsume}}</span>元
            </template>
            <template slot-scope="{ row }" slot="rate">
              <template v-if="row.isEdit">
                <Input-number  :min="0" v-model="row.rate" :max='100'></Input-number>
              </template>
              <span v-else>{{row.rate}}</span>%
            </template>
            <template slot-scope="{ row, index }" slot="actions">
              <template v-if="!row.isEdit">
                <Button type="primary" @click="editLadder(row,index)">编辑</Button>&nbsp;
                <Button type="error"  @click="delLadder(row,index)" :loading='btnLoading'>删除</Button>    
              </template>  
              <template v-else>
                <Button type="primary" @click="saveLadder(row,index)" :loading='btnLoading'>保存</Button>&nbsp;
                <Button type="error"  @click="delLadder(row,index)" :loading='btnLoading'>删除</Button>
              </template>
            </template>

        </Table>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="showModal = false"
          >取消</Button
        >
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Modal>
    <div class="drawer-footer">
      <Button @click="$emit('close')" style="margin-right: 8px">关闭</Button>
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/single-form-mixin";
import {
  get_game_platform_type_list,
  get_rakeback_platform_type_list,
  get_rakeback_detail,
  set_state_rakeback,
  set_all_enable_rakeback,
  create_rakeback_ladder,
  update_rakeback_ladder,
  delete_rakeback_ladder,
  create_rakeback_all,
  update_rakeback_single_limit
} from "@/service/index";
import { cloneDeep } from "lodash";
import {game_type,game_platform} from "@/config/enum"
export default {
  name: "rakeback-config",
  mixins: [mixin],
  props:{
    form:Object
  },
  data() {
    return {
      game_type,
      game_platform,
      singleLimit:{},
      ladder:[],
      profitRuleId:0,
      columns: [
        {
          title: "游戏平台",
          key: "platformName"
        },
        {
          title: "游戏类型",
          key: "gameTypeName"
        },
         {
          title: "游戏个数",
          key: "count"
        },
        {
          title: "单笔限额(0为无上限)",
          key: "singleLimit"
        },
        {
          title: "状态",
          key: "status",
          slot: "status"
        },
        {
          title: "操作",
          slot: "actions"
        },
      ],
      ladderColumns:[
        {
          title: "流水消费",
          key: "flowConsume",
          slot: "flowConsume"
        },
        {
          title: "返水比例",
          key: "rate",
          slot: "rate"
        },
        {
          title: "操作",
          slot: "actions"
        },
      ],
    };
  },
  computed: {
    defaultForm() {
      return [
        {
          type: 'select',
          label: '游戏平台',
          options: game_platform,
          field: 'gamePlatformId'
        },
        {
          type: 'select',
          label: '游戏类型',
          options: game_type,
          field: 'gameTypeId'
        },
      ];
    },
    // game_type_list() {
    //   return this.$store.state.base.game_type_list;
    // },
    // game_platform_list() {
    //   return this.$store.state.base.game_platform_list;
    // },
  },
  methods: {
    async setState(value, row,index) {
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
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该返水设置</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_state_rakeback(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}返水设置成功`);
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
    oneKeyEnable(){
      this.$Modal.confirm({
        title: '一键开启',
        loading: true,
        content: '<p>是否一键开启所有返水设置</p>',
        onOk: async () => {
          const res = await set_all_enable_rakeback(this.form.id);
          if (res.status < 400) {
            this.$Message.success('开启成功');
            this.$Modal.remove();
            this.getData();
          } else {
            this.$Modal.remove();
          }
        },
      });
    },
    async setting(row){
      this.showModal=true
      if(row.id){
        this.profitRuleId = row.id
        this.getRakebackDetail(this.profitRuleId)
      }else{
        this.profitRuleId = 0
        this.singleLimit = {
          gradeId:this.form.id,
          gameTypeId:row.gameTypeId,
          gamePlatformId:row.gamePlatformId,
          singleLimit:0,
        },
        this.ladder = []
      }
    },
    addLadder(row,index){
      const some = this.ladder.some((v)=> v.isEdit);
      if(some){
        this.$Message.error('请先完成编辑');
        return
      }
      if(this.profitRuleId){
        this.ladder.push({
          profitRuleId: this.profitRuleId,
          flowConsume: 0,
          rate: 0,
          isEdit: true,
          isNew: true
        });
      }else{
        this.ladder.push({
          flowConsume: 0,
          rate: 0,
          isEdit: true,
          isNew: true
        });
      }
      
    },
    async delLadder(row,index){
      if(row.isNew){
        this.$Message.success('删除成功');
        this.ladder.splice(index,1);
      }else{
        if(this.profitRuleId){
          this.btnLoading = true
          const res = await delete_rakeback_ladder(row.id);
          this.btnLoading = false
          if (res.status < 400) {
            this.$Message.success('删除成功');
            this.ladder.splice(index,1);
          } else {
            this.$Message.error('删除失败');
          }
        }else{
          this.$Message.success('删除成功');
          this.ladder.splice(index,1);
        }
      }
    },
    editLadder(row,index){
      const some = this.ladder.some((v)=> v.isEdit);
      if(some){
        return this.$Message.error('请先完成编辑');
      }
      row.isEdit = true;
      this.ladder.splice(index,1,row);
    },
    async saveLadder(row,index){
      
      if(!row.rate || !row.flowConsume) {
        this.$Message.error('流水消费或比例不可为0!');
        return
      }
      if(row.rate===100){
        this.$Message.error('比例必须小于100%');
        return
      }
      const currentTotal = row.flowConsume;
      if(index !== 0 ){
        const lastTotal = this.ladder[index - 1].flowConsume;
        if( lastTotal >= currentTotal){
          this.$Message.error('流水消费必须大于上条!');
          return
        }
      }
      if(this.ladder[index+1]){
        const nextTotal = this.ladder[index+1].flowConsume;
        if(currentTotal >= nextTotal){
          this.$Message.error('流水消费必须小于下条!');
          return
        }
      }
      row.isEdit = false;
      row.isNew = false;
      if(this.profitRuleId){
        this.btnLoading = true
        row.rate = this.toDecimal(row.rate)
        if(row.id){
          const res = await update_rakeback_ladder(row.id,row)
          if(res.status<400){
            this.$Message.success('保存一条阶梯返水成功');
          }
        }else{
          const res = await create_rakeback_ladder(row)
          if(res.status<400){
            this.$Message.success('保存一条阶梯返水成功');
          }
        }
        this.btnLoading = false
        this.getRakebackDetail(this.profitRuleId)
      }else{
        this.ladder.splice(index,1,row);
        this.$Message.success('保存一条阶梯返水成功');
      }
    },
    async ok(){
      const some = this.ladder.some((v)=> v.isEdit);
      if(some){
        return this.$Message.error('请先完成编辑');
      }
      this.btnLoading=true
      if(this.profitRuleId){
        const res = await update_rakeback_single_limit(this.profitRuleId,this.singleLimit)
        if(res.status<400){
          this.$Message.success('设置返水规则成功');
        }
      }else{
        this.ladder.forEach(v=>{
          v.rate = this.toDecimal(v.rate)
        })
        const param = {
          ...this.singleLimit,
          backWaterDetails:this.ladder
        }
        const res = await create_rakeback_all(param)
        if(res.status<400){
          this.$Message.success('设置返水规则成功');
        }
      }
      this.btnLoading=false
      this.showModal = false
      this.getData()
    },
    async getRakebackDetail(profitRuleId){
      this.loading = true
      const res = await get_rakeback_detail(profitRuleId)
      this.loading = false
      if(res.status<400){
        this.singleLimit = {
          singleLimit : res.data.singleLimit
        }
        this.ladder = res.data.backWaterDelails
        this.ladder.forEach(v=>{
          v.rate = this.toPercent(v.rate)
          v.isEdit = false
        })
      }
      
    },
    async getData() {
      this.loading = true;
      const resGame = await get_game_platform_type_list(this.query);
      const resRakeback = await get_rakeback_platform_type_list(this.form.id,this.query);
      this.loading = false;
      if (resGame.status < 400 && resRakeback.status<400) {
        this.data = resGame.data;
        this.data.forEach(v => {
          v.id = 0
          resRakeback.data.forEach(r => {
            if(v.gameTypeId === r.gameTypeId && v.gamePlatformId === r.gamePlatformId){
              v.singleLimit = r.singleLimit;
              v.status = r.status;
              v.id = r.id;
            }
          })
        })
      }
    }
  },
  mounted() {
    // if (this.game_type_list.length === 0) {
    //   this.$store.dispatch("get_game_type_list");
    // }
    // if (this.game_platform_list.length === 0) {
    //   this.$store.dispatch("get_game_platform_list");
    // }
  },
  
};
</script>
