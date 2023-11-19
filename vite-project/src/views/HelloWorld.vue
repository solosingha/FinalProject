<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Aside/>
        </el-aside>
      <el-container>
        <el-header>
          <Head/>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Head from '../components/Head.vue';
import Aside from '../components/Aside.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    Aside,
    Head
  },
});
</script>


<style lang="less" scoped>
.read-the-docs {
  color: #888;
}
.el-container{
  flex-wrap: wrap;

}
.el-header{
  padding:0;
  align-items: center;
  text-align: center;
}
.common-layout{
  height: 100%;
  & > .el-container{
    height: 100%;
    & > .el-aside{
      height: 100%;
      background: #545c64;
    }
  }
}
</style>
