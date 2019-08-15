<template>
  <div class="role-form">
    <Tabs>
      <TabPane
        :label="item.name"
        v-for="(item, index) in data"
        :key="index"
        :name="item.name"
      >
        <trees :level="1" :data="item" :index="index" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Trees from './tree';
import { get_role_permission_detail } from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  components: {
    Trees,
  },
  props: {
    permissionList: Array,
    id: Number,
  },
  data() {
    return {
      loading: false,

      data: [],
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      const res = await get_role_permission_detail(this.id);
      if (res.status < 400) {
        const permission = cloneDeep(this.permissionList);
        const data = res.data;
        permission.forEach(v => {
          if (data.indexOf(v.id) > -1) {
            v.isSelect = true;
          }
        });

        let result = [];

        getTreedata(result, permission);

        this.data = result;
      }
    },
  },
  mounted() {
    this.getData();
  },
};

const getTreedata = (result, treeList) => {
  if (result.length === 0) {
    treeList.forEach(value => {
      if (value.parentId === 0) {
        result.push({ ...value, children: [], ok: true });
      }
    });
    if (result.length === 0) {
      return;
    }
    getTreedata(result, treeList);
  } else {
    result.forEach(value => {
      value.children = [];
      treeList.forEach(v => {
        if (value.id === v.parentId) {
          value.children.push({ ...v, ok: true });
          getTreedata(value.children, treeList);
        }
      });
    });
  }
};
</script>
