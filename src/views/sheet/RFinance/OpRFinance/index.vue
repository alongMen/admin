<template>
  <div class="main-area">
    <Row>
        <Col span="20">
            <Card>
                <p slot="title" style="text-align:center;">运营报表</p>
                <p class="itemlist"><span>当前平台总余额：</span><span>{{form.platformTotalBalance}}</span></p>
                <p class="itemlist"><span>当前平台总有效用户数：</span><span>{{form.totalnumberOfActiveUsers}}</span></p>
                <p class="itemlist"><span>当前平台代理数量：</span><span>{{form.numberOfPlatformAgents}}</span></p>
                <p class="itemlist"><span>当前平台总充值：</span><span>{{form.platformTotalRecharge}}</span></p>
                <p class="itemlist"><span>当前平台总提现：</span><span>{{form.platformTotalWithdrawal}}</span></p>
                <p class="itemlist"><span>活动总增送金额：</span><span>{{form.totalAmountOfActivity}}</span></p>
                <p class="itemlist"><span>活动总赠送积分：</span><span>{{form.totalGiftPoints}}</span></p>
            </Card>
        </Col>
    </Row>

  </div>
</template>

<script>
import { 
  get_RFinance_sheet
} from '@/service/index';
export default {
  name: "OpRFinance",
  data(){
    return{
      form:{},
      btnLoading: true,
    }
  },
  computed:{

  },
  methods:{
    async getData() {
      this.btnLoading = true;
      const res = await get_RFinance_sheet();
      this.btnLoading = false;
      if (res.status == 200) {
        this.form = res.data;
      }
    },
  },
  mounted() {
    this.getData();
  },
}
</script>
<style lang="less" scoped>
.main-area{
  padding: 50px;
  min-height: 600px;
  .itemlist{display: flex; line-height:30px;text-align: right;
   span:first-child{width: 200px;text-align: right;}
  }
  // .itemlist:last-child{color: rgb(174, 0, 255);padding-right:20px;
  //   span{
  //     width:100%;
  //     font-size:16px;
  //     cursor: pointer;
  //     &:hover{color:#3b69e2;}
  //   .ivu-icon{line-height: 32px;padding-left: 5px;}
  //   }
  // }
  .editForm{padding: 20px;box-sizing: border-box;}
}

.ivu-row{margin-right: 15px!important;}

</style>