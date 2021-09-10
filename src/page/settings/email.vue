<template>
  <div class="settings-email-box">

    <el-form label-width="100px" size="medium">

      <el-form-item label="新邮箱地址">
        <el-input v-model="newEmail"></el-input>
        <el-button v-if="!isCountingDown" type="primary" @click="getVerifyCode" class="email-get-verify-code-btn">获取验证码</el-button>
        <el-button v-else type="primary" class="email-get-verify-code-btn" disabled>{{ getVerifyCodeBtnText }}</el-button>
      </el-form-item>

      <el-form-item label="验证码">
        <el-input v-model="verifyCode" class="email-verify-code-input"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateEmailAddr">更新邮箱</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import * as Api from '../../api/api'
export default {
  name: "email.vue",
  data() {
    return {
      newEmail: '',
      verifyCode: '',
      getVerifyCodeBtnText: '重新发送（60）',
      isCountingDown: false,
    }
  },
  methods: {
    updateEmailAddr() {
      if (this.newEmail === '') {
        this.$message.error('邮箱地址不能为空');
        return;
      }
      if (this.verifyCode === '') {
        this.$message.error('验证码不能为空');
        return;
      }
      Api.updateEmailAddr(this.newEmail, this.verifyCode).then(result => {
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.verifyCode = '';
          this.newEmail = '';
        } else {
          this.$message.error(result.message);
          this.verifyCode = '';
        }
      })
    },
    getVerifyCode() {
      //1、校验邮箱格式
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.newEmail)) {
        this.$message.error('邮箱格式不正确');
        return
      }
      //this.$message.success('邮箱格式正确');
      //2、禁止按钮，开始倒计时

      //3、发起请求
      Api.getVerifyCode(this.newEmail, 'update').then(result => {
        if (result.code === Api.success_code) {
          this.startCountDown();
          this.$message.success(result.message);
        } else  {
          this.$message.error(result.message);
        }
      });
    },
    startCountDown() {
      let time = 60;
      this.isCountingDown = true;
      this.getVerifyCodeBtnText = '重新发送（60）';
      let that = this;
      let interval = setInterval(function (){
        time--;
        if (time <= 0) {
          that.isCountingDown = false;

          clearInterval(interval);
        }
        that.getVerifyCodeBtnText = '重新发送（' + time + '）';
      },1000);
    },
  }
}
</script>

<style>
  .settings-email-box .el-input{
    max-width: 250px;
  }

  .email-get-verify-code-btn {
    margin-left: 20px;
  }
</style>