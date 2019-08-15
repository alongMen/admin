<template>
  <div class="index-init">
    <div class="loading">
      <Spin></Spin>
      <p>加载中...</p>
    </div>
  </div>
</template>


<script>
import {get_user_permission} from '@/service/index';



const generate_tree = (result , tree)=>{
  if(tree.length === 0 ){
    return;
  }
  if(result.length === 0 ){
    tree.forEach((v)=>{
      if(v.parentId === 0 ){

         const obj = {
          name: v.name,
          path: v.code,
          children: [],
          id: v.id,

        };

        if(v.code === 'system'){
          obj.icon = 'icon_lgdbs_system'
        }else if(v.code ==="game" ){
          obj.icon = 'icon_lgdbs_game'
        }else if(v.code ==="user" ){
          obj.icon = 'icon_lgdbs_user'
        }else if(v.code ==="finance" ){
          obj.icon = 'icon_lgdbs_finance'
        }else if(v.code === 'operation'){
          obj.icon = 'icon_lgdbs_operation'
        }
        result.push(obj)

      }
    });
    if (result.length === 0) {
			return;
		}
    generate_tree(result , tree);
  }else{
    result.forEach((v1)=>{
      v1.children = [];
      tree.forEach((v2)=>{
        if(v2.parentId === v1.id){
          const obj = {
            name: v2.name,
            path: v2.code,
            children: [],
            id: v2.id,
            parentId: v2.parentId,
          };
          v1.children.push(obj);
          generate_tree(v1.children , tree);
        }
      })
    });
  }
}

export default {
  data(){
    return{
      route_list: ['unauthorized' , 'login' , 'main'],
      loading: true,
    }
  },

  async mounted(){
    const res = await get_user_permission();
    if(res.status < 400 ){
      const tree = res.data;
      const route_list = ['unauthorized' , 'login' , 'main'];
      tree.forEach((v)=>{
        if(v.permissionMode === 1){
          route_list.push(v.code);
        }
      })
      this.route_list = route_list;
      let result = [];
      generate_tree(result , tree);
      this.$store.commit('permission_set_tree_list',result);
      this.loading = false;
      const name = this.$route.name;
      console.log(name);
      const ok = this.route_list.indexOf(name) > -1;
      if(ok){
       
      }else{
        this.$router.push('/unauthorized');
      }
    }
  },
}
</script>



<style lang="less">
.index-init{
  width: 100%;
  height: 100%;


  .loading{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
