<template>
  <div class="main-area">
    <Row>
        <Col span="20">
            <Card>
                <p slot="title" style="text-align:center;">任务报表</p>
                <p class="itemlist"><span>今日充值人数：</span><span>{{form.todayRechargeNum}}</span></p>
                <p class="itemlist"><span>今日签到人数：</span><span>{{form.todaySignInNum}}</span></p>
                <p class="itemlist"><span>今日总充值额：</span><span>{{form.todayTotalRecharge}}</span></p>
                <p class="itemlist"><span>今日注册人数：</span><span>{{form.todayRegisterNum}}</span></p>
            </Card>
        </Col>
    </Row>

  </div>
</template>

<script>
import { 
  get_Liveness_sheet
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
      const res = await get_Liveness_sheet();
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
  .editForm{padding: 20px;box-sizing: border-box;}
}

.ivu-row{margin-right: 15px!important;}

</style>