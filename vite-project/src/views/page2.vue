<template>
  <el-button @click="add_item">添加账单</el-button>
  <el-card style="margin-top: 20px">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="number" label="序号" width="100" />
      <el-table-column prop="date" label="时间" width="180" />
      <el-table-column prop="id" label="客户名称" width="100" />
      <el-table-column prop="type" label="收支类型" />
      <el-table-column prop="description" label="收支描述" />
      <el-table-column prop="income" label="收入" />
      <el-table-column prop="expenses" label="支出" />
      <el-table-column prop="remain" label="账户余额" />
      <el-table-column prop="comment" label="备注" />
      <el-table-column label="操作">
        <el-button>审批</el-button>
        <el-button>删除</el-button>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog title="请添加：" v-model="dialog" width="50%" height="50%">
    <el-form :model="addform">
      <el-form-item label="客户账户" width="100px" style="margin-top: 5px">
        <el-input
          v-model="addform.customer_number"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间" width="100px" style="margin-top: 5px">
        <el-date-picker
          v-model="addform.register_time"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="收支类型" width="100px" style="margin-top: 5px">
        <el-select  v-model="addform.moneytype" 
          style="width: 150px;background-color: rgb(238, 241, 246)">
          <el-option v-for="(i, idx) in allmoneytype" :key="i" :label="i" :value="i">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" width="100px" style="margin-top: 5px">
        <el-input
          v-model="addform.money"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" width="100px" style="margin-top: 5px">
        <el-input
          v-model="addform.comments"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button type="warning" @click="submitaddForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import service from "../utils/request";
import { ref, reactive } from "vue";
let dialog = ref(false);
import { ElMessage } from 'element-plus'
import http from "../http/index";

const add_item = () => {
  // 添加节
  console.log(dialog.value);
  dialog.value = true;
  console.log(dialog.value);
};
const allmoneytype = ['收入','支出']
const addform = reactive({
  register_time:"",
  customer_name: "",
  customer_number: "",
  moneytype: "",
  comments: "",
  money: "",
});
const submitaddForm = () => {
  const date = new Date(addform.register_time);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const m1 = m < 10 ? `0${m}` : m;
  const d = date.getDate();
  const d1 = d < 10 ? `0${d}` : d;
  addform.register_time = `${y}-${m1}-${d1}`;
  if (addform.customer_name.length === 0) {
    ElMessage({
      showClose: true,
      message: "请输入客户名称！",
      type: "warning",
    });
  } else {
    service({
      url: "/add_bill",
      method: "post",
      data: addform,
    })
      .then((response) => {
        if (response.data.message === "已成功添加客户") {
          dialog.value = false
          ElMessage({
            showClose: true,
            message: "已成功添加客户!",
            type: "success",
          });
        } else {
          ElMessage({
            showClose: true,
            message: `新增失败!原因：${response.data.msg}`,
            type: "warning",
          });
          router.go(0);
        }
      })
      .catch((error) => {
        ElMessage({
          showClose: true,
          message: `上传失败！${error}`,
          type: "error",
        });
      });
  }
};
</script>
