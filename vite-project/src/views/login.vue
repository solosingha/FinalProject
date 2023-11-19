<template>
    <div align="center" style="background-color:#b8870b10; padding:20vh 0 20vh 0">
        <el-card class="login-box">
            <el-container>
                <el-aside style="width:30%">
                    <div align="middle">
                        <el-tooltip effect="dark" content="hello">
                            <img src="../static/login_logo.jpg"
                                 width="95"
                                 class="home_image"
                                 @click="gohome()"
                                 style="margin-top:30px" />
                        </el-tooltip>
                    </div>
                </el-aside>
                <el-col>
                    <div>
                        <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px">
                            <h3 class="login-title">welcome</h3>
                            <el-form-item style="padding:0 0 15px 0" label="account" prop="username">
                                <el-input type="text" placeholder="please enter account number" v-model="form.username" />
                            </el-form-item>
                            <el-form-item style="padding:0 0 15px 0" label="password" prop="password">
                                <el-input type="password" placeholder="please enter password" v-model="form.password" />
                            </el-form-item>
                            <el-form-item>
                                <el-button style="margin:10px 0 50px 0;box-shadow: 0 0 5px 0 #b3b3b3;" type="warning" v-on:click="onSubmit('loginForm')">login</el-button>
                                <!--<router-link to="/Register">
                                    <el-button type="info" style="margin-left:30px;box-shadow: 0 0 5px 0 #b3b3b3;">register</el-button>
                                </router-link>-->
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>

                <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
                    <span>请输入账号和密码</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="warning" @click="dialogVisible = false">确 定</el-button>
                    </span>
                </el-dialog>
            </el-container>
        </el-card>
    </div>
</template>

<script>
    import service from '../utils/request'
    import Cookies from 'js-cookie'
    import { useRouter } from 'vue-router'
    export default {
        name: "Login",
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                },
                // 表单验证，需要在 el-form-item 元素中增加 prop 属性
                rules: {
                    username: [
                        { required: true, message: 'No Empty', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'No Empty', trigger: 'blur' }
                    ]
                },
                // 对话框显示和隐藏
                dialogVisible: false
            }
        },
        methods: {
             onSubmit(formName) {
                // 为表单绑定验证功能
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        service({
                            url: '/login', method: 'post', data: {
                                name: this.form.username,
                                password: this.form.password,
                                remember_me: true
                            }
                        })
                            .then(response => {
                                Cookies.set('Authorization', response.data.token)
                                console.log(response.data.msg)
                                if (response.data.msg == "Success") {
                                    window.sessionStorage.setItem("auth", response.data.userAuth)
                                    window.sessionStorage.setItem("summerschool", response.data.usersummerschool)
                                    if (response.data.userAuth == 1) {
                                        this.$store.commit('set_is_administrator')
                                    } else {
                                        this.$store.commit('set_not_administrator')
                                    }
                                    if (response.data.usersummerschool == 8) {
                                        this.$store.commit('set_is_summerschoolstudent')
                                    } else {
                                        this.$store.commit('set_not_summerschoolstudent')
                                    }
                                    this.$message({
                                        message: '登陆成功！',
                                        type: 'success'
                                    });
                                    this.$store.commit('change_state_in')
                                    this.$store.commit('set_username', this.form.username)
                                    this.$router.go(-1)
                                }
                                if (response.data.msg == 'userName and userPassword should be filled in') {
                                    this.$message({
                                        message: '登陆失败，请输入用户名或密码！',
                                        type: 'warning'
                                    });
                                }
                            })
                            .catch(error => {
                                this.$store.commit('change_state_out')
                                if (error.response.data.msg == this.form.username + ' has not been confirmed.') {
                                    this.$message({
                                        message: '登陆失败，用户名尚未审核通过！',
                                        type: 'warning'
                                    });
                                } else if (error.response.data.msg == 'Invalid username or password.') {
                                    this.$message({
                                        message: '登陆失败，请检查账号密码是否正确！',
                                        type: 'warning'
                                    });
                                }
                            })
                    } else {
                        this.dialogVisible = true;
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="css" scoped>
    .el-aside {
        border-right: 1px solid rgb(224, 217, 217);
    }

    .login-box {
        border: 1px solid #b3b3b3;
        width: 90%;
        /*padding: 50px 50px 30px 30px;*/
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        box-shadow: 0 0 15px #b3b3b3;
    }

    .home_image {
        padding: 12% 0 0 0;
    }

    .home_image:hover {
        cursor: pointer;
    }

    .login-title {
        text-align: left;
        margin: 0 auto 40px 30px;
        font-size: 20px;
        color: #303133;
    }

    .el-input {
        width: 40%;
    }
</style>