<template>
  <el-card>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="number" label="序号" width="100" />
    <el-table-column prop="date" label="时间" width="180" />
    <el-table-column prop="id" label="客户id" width="100" />
    <el-table-column prop="type" label="收支类型" />
    <el-table-column prop="description" label="收支描述" />
    <el-table-column prop="income" label="金额" />
    <el-table-column prop="remain" label="账户余额" />
    <el-table-column prop="comment" label="备注" />
    <el-table-column label="操作">
    <el-button>解约</el-button>
    <el-button>删除</el-button>
    </el-table-column>
  </el-table>
</el-card>
</template>

<script lang="ts" setup>
const tableData = [
  {
    number:'1',
    date: '2016-05-03',
    id:'1',
    type:'转账',
    description:'收入',
    income:'2000',
    expenses:'2000',
    remain:'0',
    comment:'备注',
  },
  {
    number:'1',
    date: '2016-05-03',
    id:'1',
    type:'转账',
    description:'收入',
    income:'2000',
    expenses:'2000',
    remain:'0',
    comment:'备注',
  },
  {
    number:'1',
    date: '2016-05-03',
    id:'1',
    type:'转账',
    description:'收入',
    income:'2000',
    expenses:'2000',
    remain:'0',
    comment:'备注',
  },
  {
    number:'1',
    date: '2016-05-03',
    id:'1',
    type:'转账',
    description:'收入',
    income:'2000',
    expenses:'2000',
    remain:'0',
    comment:'备注',
  },
]
</script>
