<template>
    <div>
      <Row >
            <!-- <Col span="8">
                <span class="expand-key">赠送金额: </span>
                <span class="expand-value">{{ parsePrice(row.give) }}</span>
            </Col> -->
            <Col span="8">
                <span class="expand-key">充值金额: </span>
                <span class="expand-value">{{ parsePrice(row.amount) }}</span>
            </Col>
             <Col span="8">
                <span class="expand-key">随机金额: </span>
                <span class="expand-value">{{ parsePrice(row.random) }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">手续费率: </span>
                <span class="expand-value">{{ parsePrice(row.rate) }}%</span>
            </Col>
             <Col span="8">
                <span class="expand-key">手续费: </span>
                <span class="expand-value">{{ parsePrice(row.fee) }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">到账金额: </span>
                <span class="expand-value">{{ parsePrice(row.total) }}</span>
            </Col>
        </Row>
        <Row >
            <Col span="8">
                <span class="expand-key">审核意见: </span>
                <span class="expand-value">{{ row.auditOpinion }}</span>
            </Col>
              <Col span="8">
                <span class="expand-key">审核时间: </span>
                <span class="expand-value">{{ formatBeijingDate(row.auditTime) }}</span>
            </Col>
        </Row>
        <Row>
            <!-- <Col span="8">
                <span class="expand-key">支付凭据: </span>
                <span class="expand-value">{{ row.payImageUrl }}</span>
            </Col> -->
            <Col span="8">
                <span class="expand-key">充值有效时间: </span>
                <span class="expand-value">{{ formatBeijingDate(row.effectiveTime) }}</span>
            </Col>
             <Col span="8">
                <span class="expand-key">创建时间: </span>
                <span class="expand-value">{{ formatBeijingDate(row.createTime) }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">完成时间: </span>
                <span class="expand-value">{{ formatBeijingDate(row.finishTime) }}</span>
            </Col>
           
            <!-- <Col span="8">
                <span class="expand-key">到账时间: </span>
                <span class="expand-value">{{ row.paymentTime }}</span>
            </Col> -->
          
        </Row>
        <Row>
            
            
        </Row>
    </div>
</template>

<script>
  export default {
    props: {
        row: Object
    },
    methods:{

    }
  };
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>