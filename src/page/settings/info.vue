<template>
  <div class="settings-user-info-box">
    <div class="user-info-list-part">
      <el-form label-width="100px" v-if="userInfo !== null">
        <el-form-item label="用户ID">
          <el-input type="text" v-model="userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" >
          <el-input type="email" v-model="userInfo.email" disabled></el-input>
          <el-button type="primary" class="update-email-btn" @click="toUpdateEmailPage">修改邮箱</el-button>
        </el-form-item>
        <el-form-item label="用户名" >
          <el-input type="text" v-model="userInfo.userName"></el-input>
        </el-form-item>

        <el-form-item label="签名" >
          <el-input type="text" v-model="userInfo.sign" ></el-input>
        </el-form-item>
        <el-form-item label="头像" class="user-info-avatar">
          <div class="user-avatar-box" @click="showAvatarDialog">
            <el-avatar :src="blog_constants.baseUrl + userInfo.avatar"></el-avatar>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserInfo">修改用户信息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-info-dialog">
      <avatar-upload field="file"
                 @crop-upload-success="cropUploadSuccess"
                 @crop-upload-fail="cropUploadFail"
                 v-model="showAvatarCutter"
                 :width="300"
                 :height="300"
                 url="/admin/image/avatar"
                 img-format="png">
      </avatar-upload>
    </div>

  </div>
</template>

<script>
import * as Api from '../../api/api'
import avatarUpload from 'vue-image-crop-upload/upload-2.vue';
export default {
  name: "info.vue",
  components: {
    'avatar-upload': avatarUpload
  },
  data() {
    return {
      userInfo: null,
      showAvatarCutter: false,
      lastUserName:''
    }
  },
  methods: {
    cropUploadSuccess( response ) {
      if (response.code === Api.success_code) {
        this.userInfo.avatar = '/portal/image/' + response.data.id;
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
    },
    cropUploadFail() {
      this.$message.error("上传失败");
    },
    showAvatarDialog(){
      this.showAvatarCutter = true;
    },
    getUserInfo() {
      Api.checkToken().then(result => {
        if (result.code === Api.success_code) {
          this.userInfo = result.data;
          this.lastUserName = this.userInfo.userName;
        } else {
          this.$message.error(result.message);
        }
      })
    },
    toUpdateEmailPage(){
      this.$router.push('/settings/email');
    },
    updateUserInfo() {
      if (this.userInfo.userName === '') {
        this.$message.error('用户名不能为空');
        return;
      }

      if (this.lastUserName === this.userInfo.userName) {
        this.doUpdateInfo();
      } else {
        Api.checkUserName(this.userInfo.userName).then(result => {
          if (result.code === Api.failed_code) {
            this.$message.success(result.message)
            this.doUpdateInfo();
          } else {
            this.$message.error(result.message)
          }
        })
      }
    },
    doUpdateInfo(){
      if (this.userInfo.avatar === '') {
        this.$message.error('头像不能为空');
        return;
      }
      Api.updateUserInfo(this.userInfo, this.userInfo.id).then(result => {
        if (result.code === Api.success_code) {
          this.getUserInfo();
          this.$message.success(result.message);
        }else {
          this.$message.error(result.message);
        }
      })
    }
  },

  mounted() {
    this.getUserInfo();
  }
}
</script>

<style>
  .settings-user-info-box .el-input{
    max-width: 250px;
  }

  .update-email-btn {
    margin-left: 20px;
  }


  .user-avatar-box{
    width: 46px;
    cursor: pointer;
  }

</style>