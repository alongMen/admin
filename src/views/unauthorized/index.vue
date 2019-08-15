<template>
  <div class="unauth">
    <div class="left">
      <div class="pic"></div>
    </div>
    <div class="right-9527">
      <p class="not-found-text">401</p>
      <p class="normal-text">对不起，您的访问未授权！请联系管理员</p>


      <div class="to-home" @click="toHome">
        返回首页
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'not-found',
  methods:{
    toHome(){
      window.location.href = '/'
    }
  }
};
</script>



<style lang="less">
.unauth {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  // flex-direction: column;
  background: #fff;
  align-items: center;
  justify-content: center;
  .left{
    .pic {
      width: 384px;
      height: 389px;
      background: url(/404.png) no-repeat;
      margin-right: 200px;
      
    }
  }

  .right-9527 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .not-found-text {
      font-family: Arial-Black;
      font-size: 160px;
      color: #1951fc;
      letter-spacing: 12.8px;
      text-shadow: -10px 5px 5px rgba(25, 81, 252, 0.5);
      user-select: none;
    }
    .normal-text {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #333333;
      letter-spacing: 0;
      margin-top: 110px;
      margin-bottom: 25px;
    }
    .dot-text {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
      letter-spacing: 0;
      position: relative;
      margin-bottom: 10px;
      &::before {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: absolute;
        background: #1951fc;
        content: '';
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .to-home {
      width: 100px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      background: #1951fc;
      border-radius: 100px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      user-select: none;
      cursor: pointer;
      margin-top: 50px;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
