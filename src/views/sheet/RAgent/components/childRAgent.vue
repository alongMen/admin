<template>
    <div>
         <div class="table-area">
            <Table :columns="columns" :data="data" :loading="loading">
                <template slot-scope="{ row }" slot="isAgent">
                    <span v-if="row.isAgent">是</span>
                    <span v-if="!row.isAgent" style="color:orange">否</span>
                </template>
            </Table>
        </div>
    </div>
</template>
<script>
import { get_RAgent_child_sheet } from '@/service/index';
export default {
    name:'childRAgent',
    props:{
        form:Object
    },
    data(){
        return{
            data:[],
            loading:false,
            columns: [
                {
                    title: '会员Id',
                    key: 'memberId',
                },
                {
                    title: '下级第几层',
                    key: 'depth',
                },
                {
                    title: '用户名',
                    key: 'userName',
                },
                {
                    title: '别称',
                    key: 'nickName',
                },
                {
                    title: '是否代理',
                    slot: 'isAgent',
                },
            ]
        }
    },
    methods:{
        async getData() {
            this.loading = true;
            const res = await get_RAgent_child_sheet(this.form.userId);
            this.loading = false;
            if (res.status === 200) {
                const data = res.data;
                this.data = data;
            }
        },
    },
    mounted(){
        // console.log(this.form);
        this.getData();
    }
}
</script>
