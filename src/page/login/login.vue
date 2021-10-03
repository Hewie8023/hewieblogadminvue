<template>
  <div class="admin-login-box">
    <div class="admin-login-header-box">
      <div class="admin-login-header-center center">
        <div class="admin-login-logo">
          幸运的两小只 | 登录
        </div>
      </div>
    </div>
    <div class="admin-login-center-box">
      <div class="center admin-login-center-content-box">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form label-position="right"
                     label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="hewieUser.userName"
                          placeholder="用户名/邮箱"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password"
                          v-model="originalPassword"
                          placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item label="人类验证码">
                <el-input v-model="loginInfo.verifyCode"
                          placeholder="请输入右侧验证码"
                          @keyup.enter.native="doLogin"></el-input>
                <img :src="captchaPath"
                     @click="updateVerifyCode"
                     class="captcha-code">
              </el-form-item>
              <el-form-item label-width="0px"
                            class="admin-login-center-content-button">
                <el-button type="primary"
                           @click="doLogin">登录</el-button>
              </el-form-item>
            </el-form>
          </el-col>

        </el-row>

      </div>
    </div>
  </div>
</template>

<script>
import { doLogin } from '../../api/api'
import { hex_md5 } from "../../utils/md5";
export default {

  name: "login.vue",
  data () {
    return {
      hewieUser: {
        userName: '',
        password: '',
      },
      loginInfo: {
        verifyCode: '',
        from: 'p_',
      },
      captchaPath: '',
      originalPassword:''
    }
  },
  methods: {
    toastE (msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'error'
      })
    },
    doLogin () {
      //发起登录

      //检查数据
      if (this.hewieUser.userName === '') {
        this.toastE('用户名不能为空');
        return;
      }
      if (this.originalPassword === '') {
        this.toastE('密码不能为空');
        return;
      }
      if (this.loginInfo.verifyCode === '') {
        this.updateVerifyCode();
        this.toastE('人类验证码不能为空');
        return;
      }
      this.hewieUser.password = hex_md5(this.originalPassword);
      //向服务器提交数据
      //处理结果
      doLogin(this.loginInfo.verifyCode,
        this.loginInfo.from,
        this.hewieUser)
        .then(result => {
          //处理登录结果
          //判断状态

          if (result.code === 2001) {
            //跳转
            this.$message({
              message: result.message,
              center: true,
              type: 'success'
            })
            this.$router.push({ path: '/index' });
          } else {
            this.updateVerifyCode();
            this.$message({
              message: result.message,
              center: true,
              type: 'error'
            })
          }

        });
    },
    updateVerifyCode () {
      this.captchaPath = '/user/captcha' + "?&random = " + Date.parse(new Date());
      //console.log(this.captchaPath);
    }
  },
  mounted () {
    //todo 检查token
    this.updateVerifyCode();
  }
}
</script>

<style>
.admin-login-header-box {
  width: 100%;
  background: #0084ff;
  height: 46px;
  margin-bottom: 20px;
}

.center {
  margin: 0 auto;
  width: 1140px;
}

.admin-login-header-center {
  line-height: 46px;
}

.admin-login-logo {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.admin-login-center-content-box {
  width: 1100px;
  background: #fff;
  box-shadow: 0 1px 10px #afafaf;
  border-radius: 5px;
  padding: 20px;
}
.admin-login-center-content-box .el-input {
  width: 50%;
}

.admin-login-center-content-box .el-form-item__label {
  background: #f9fafb;
  text-align: center;
  border-top: #dcdfe6 solid 1px;
  border-left: #dcdfe6 solid 1px;
  border-bottom: #dcdfe6 solid 1px;
}

.admin-login-center-content-box .el-input__inner {
  border-radius: unset;
  border: #dcdfe6 solid 1px;
  height: 42px;
}

.admin-login-center-content-box .el-input__inner:hover {
  border: #c0c4cc solid 1px;
}

.admin-login-center-content-button {
  margin-bottom: 0px;
  border-left-width: unset;
}
.admin-login-center-content-button .el-form-item__content {
  margin-left: 200px;
}

.captcha-code {
  cursor: pointer;
  width: 120px;
  height: 40px;
  vertical-align: middle;
  margin-left: 10px;
  border: #dcdfe6 solid 1px;
}
.captcha-code:hover {
  border: #c0c4cc solid 1px;
}
</style>