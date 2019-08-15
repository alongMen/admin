<template>
  <div class="main-area">
    <Row>
        <Col span="20">
            <Card>
                <p slot="title" style="text-align:center;">任务报表</p>
                <p class="itemlist"><span>今日任务全部完成数：</span><span>{{form.mission}}</span></p>
                <p class="itemlist"><span>今日任务送出积分数：</span><span>{{form.integration}}</span></p>
                <p class="itemlist"><span>今日任务送出金额：</span><span>{{form.amount}}</span></p>
            </Card>
        </Col>
    </Row>

  </div>
</template>

<script>
import { 
  get_Mission_sheet
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
      const res = await get_Mission_sheet();
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