<template>
  <div>
    <Table :data="withdrawalRuleDetails"    :columns="columns"   >
          <template slot-scope="{ row }" slot="histortyRecharge">
            <span >{{row.histortyRecharge}}</span>元
          </template>

          <template slot-scope="{ row }" slot="serviceRate">
            <span >{{row.serviceRate}}</span>%
          </template>

          <template slot-scope="{ row }" slot="serviceMaxFee">
            <span >{{row.serviceMaxFee}}</span>元
          </template>

      </Table>
  </div>
</template>

<script>
export default {
  name: "draw-expand-row",
  props:{
    withdrawalRuleDetails:Array
  },data(){
    return {
      columns: [
        {
          title: "历史总存款",
          key: "histortyRecharge",
          slot: "histortyRecharge"
        },
        {
          title: "手续费率",
          key: "serviceRate",
          slot: "serviceRate"
        },
        {
          title: "手续费上限(0为无上限)",
          key: "serviceMaxFee",
          slot: "serviceMaxFee"
        },
        
      
      ],
    }
  }
}
</script>