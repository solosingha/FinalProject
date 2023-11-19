<template>
  <el-button @click="add_item">添加客户</el-button>
  <el-card style="margin-top: 20px">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="register_time" label="时间" width="180" />
      <el-table-column prop="customer_name" label="客户名称" width="180" />
      <el-table-column prop="customer_number" label="账户" />
      <el-table-column prop="state" label="状态" />
      <el-table-column prop="money" label="资金" />
      <el-table-column label="操作">
        <el-button>解约</el-button>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog title="请添加客户信息：" v-model="dialog" width="50%" height="50%">
    <el-form :model="addform">
      <el-form-item label="客户名称" width="100px" style="margin-top: 5px">
        <el-input v-model="addform.customer_name" autocomplete="off"></el-input>
      </el-form-item>
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
      <el-form-item label="初始账户金额" width="100px" style="margin-top: 5px">
        <el-input v-model="addform.money" autocomplete="off"></el-input>
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

interface Userdata {
  customer_name: String;
  customer_number: Number;
  register_time: String;
  state: Number;
  money: Number;
}
const tableData = reactive<Userdata[]>([]);

const get_data = () => {
  http
    .request({
      url: "/get_customer",
      method: "get",
    })
    .then((response: any) => {
      for (let i = 0; i < response.data.customer.length; i++) {
        let test_detail = {
          customer_number: Number(response.data.customer[i].customer_number),
          customer_name: String(response.data.customer[i].customer_name),
          register_time: String(response.data.customer[i].register_time),
          money: Number(response.data.customer[i].money),
          state:
            String(response.data.customer[i].state) == "1" ? "签约" : "解约",
        };
        tableData.push(test_detail);
      }
    });
};
get_data();
const add_item = () => {
  dialog.value = true;
};
const addform = reactive({
  customer_name: "",
  customer_number: "",
  register_time: "",
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
      url: "/add_customer",
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
