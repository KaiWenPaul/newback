<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 如有问题请联系管理员。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        // localStorage.setItem('ms_username',this.ruleForm.username);
                        // this.$router.push('/');
                          var params ={};
                          params.merchants_account =this.ruleForm.username;
                          params.password = this.ruleForm.password;
                          params.is_default =0;
                          this.$ajax.postu(url+'systemController.api?merchantsLogin', params).then((res) => {
                            if (res.status == "ok") {
                              localStorage.setItem('token',res.data.merchants_token);
                              localStorage.setItem('account_id',res.data.merchants_account_id);
                              localStorage.setItem('account',res.data.merchants_account);
                            //   localStorage.setItem('menus',JSON.stringify(res.data.list));
                              localStorage.setItem('ms_username',res.data.merchants_name);
                              this.$router.push('/dashboard');

                            } else {
                                this.$message({
                                message: res.error,
                                type: 'error'
                                });
                            }
                        });
                        // this.$ajax.postu(urlB+'sys/login', this.ruleForm).then((res) => {
                        //     if (res.msg == "success") {
                        //       localStorage.setItem('token',res.data.token);
                        //       localStorage.setItem('account_id',res.data.accountInfo.account_id);
                        //     //   localStorage.setItem('menus',JSON.stringify(res.data.list));
                        //       localStorage.setItem('ms_username',res.data.accountInfo.nickname);
                        //       this.$router.push('/dashboard');

                        //     } else {
                        //         this.$message({
                        //         message: res.msg,
                        //         type: 'error'
                        //         });
                        //     }
                        // });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #666;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>