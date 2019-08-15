<template>
  <div class="role-tree">
    <Row class="role-tree-main">
      <Col span="12">
        <span v-for="num in level" :key="num" class="blank"></span>
        <span class="name">{{ data.name }}</span>
      </Col>
      <Col span="12">
        <Checkbox
          v-model="data.isSelect"
          :disabled="parentId && !parent.isSelect"
          >选择</Checkbox
        >
      </Col>
    </Row>
    <trees
      :data="child"
      v-for="(child, index) in data.children"
      :key="index"
      :parent="data"
      :parentId="data.id"
      :level="level + 1"
    ></trees>
  </div>
</template>

<script>
export default {
  name: 'trees',
  props: {
    data: Object,
    level: {
      type: Number,
      default: 0,
    },
    parent: Object,
    index: Number,
    parentId: Number,
  },

  data() {
    return {
      open: false,
    };
  },
  watch: {
    parent: {
      // immediate: true,
      deep: true,
      handler: function(newParent) {
        if (!newParent.isSelect) {
          this.data.isSelect = false;
        }
      },
    },
  },

  methods: {},
};
</script>

<style lang="less">
.role-tree {
  .role-tree-main {
    border-bottom: 1px dotted #ccc;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 10px;
  }

  .blank {
    width: 40px;
    height: 20px;
    visibility: hidden;
    display: inline-block;
  }
}
</style>
