<template>
  <el-aside width="200px">
      <el-menu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" unique-opened>
        <h3>用户管理</h3>
        <el-menu-item :index="item.path" v-for="item in noChildren()" :key="item.path"
        @click="clickMenu(item)">
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </el-menu-item>
        <el-sub-menu :index="item.path" v-for="item in hasChildren()" :key="item.path">
          <template #title>
            <component class="icons" :is="item.icon"></component>
            <span>{{ item.label }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="subItem.path" v-for="(subItem,subIndex) in item.children" :key="subIndex"
            @click="clickMenu(subItem)">
              <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
const list=[
  {
    path:'/user',
    name:'user',
    label:'客户管理',
    url:'UserManager/UserManager',
    icon:'user'
  },
  {
    label:'资金管理',
    icon:'location',
   children:[
    {
      path:'/page1',
    name:'page1',
    label:'客户出入金管理',
    url:'Other/PageOne',
    icon:'setting'
    },
    {
      path:'/page2',
    name:'page2',
    label:'清算结算',
    url:'Other/PageTwo',
    icon:'setting'
    }
   ]
  },
  {
    path:'/chargemanage',
    name:'charge',
    label:'手续费管理',
    url:'charge/charge',
    icon:'user'
  }
]
const noChildren=()=>{
  return list.filter((item)=>!item.children)
}
const hasChildren=()=>{
  return list.filter((item)=>item.children)
}
const router = useRouter()
const clickMenu=(item:any)=>{
  router.push({
    name:item.name,
  })
}

</script>
<style lang="less" scoped>
.el-menu{
  border-right:none;
  h3{
    line-height: 48px;
    color: #fff;
  text-align: center;
  }

}

</style>
