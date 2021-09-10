<template>
  <div class="settings-website-info-box">
    <el-form label-width="80px" >
      <el-form-item label="网站名称">
        <el-input v-model="websiteTitle"></el-input>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="keywords" placeholder="关键字请用 ' , ' 隔开"></el-input>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input type="textarea" v-model="description"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="updateWebsiteInfo">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as Api from '../../api/api'
export default {
  name: "website-info.vue",
  data() {
    return {
      websiteTitle:'',
      keywords:'',
      description:'',
      oldInfo:{
        websiteTitle:'',
        keywords:'',
        description:'',
      }
    }
  },
  mounted() {
    this.getWebSiteTitle();
    this.getWebsiteSeoInfo();
  },
  methods:{
    getWebsiteSeoInfo(){
      Api.getWebSiteSeoInfo().then(result => {
        if (result.code === Api.success_code) {
          this.keywords = result.data.website_keywords;
          this.description = result.data.website_description;
          this.oldInfo.keywords = this.keywords;
          this.oldInfo.description = this.description;
        }
      })
    },
    getWebSiteTitle(){
      Api.getWebSiteTitle().then(result => {
        if (result.code === Api.success_code) {
          this.websiteTitle = result.data.value;
          this.oldInfo.websiteTitle = this.websiteTitle;
        }
      })
    },
    updateWebsiteInfo(){
      if (this.websiteTitle === '') {
        this.$message.error('网站名称不能为空');
        return;
      }
      if (this.keywords === '') {
        this.$message.error('网站关键词不能为空');
        return;
      }
      if (this.description === '') {
        this.$message.error('网站描述不能为空');
        return;
      }
      let isUpdateSeoInfo = false;
      if (this.description !== this.oldInfo.description ||
          this.keywords !== this.oldInfo.keywords) {
        isUpdateSeoInfo = true;
        Api.updateWebsiteSeo(this.description, this.keywords).then(result=>{
          if (result.code === Api.success_code) {
            this.$message.success(result.message)
            this.getWebsiteSeoInfo();
          } else {
            this.$message.error(result.message);
          }
        })
      }
      if (this.websiteTitle !== this.oldInfo.websiteTitle) {
        Api.updateWebsiteTitle(this.websiteTitle).then(result=>{
          if (result.code === Api.success_code) {
            if (!isUpdateSeoInfo) {
              this.$message.success(result.message)
            }
            this.getWebSiteTitle();
          } else {
            this.$message.error(result.message)
          }
        })
      }

    }
  }
}
</script>

<style>
  .settings-website-info-box .el-input,.settings-website-info-box .el-textarea {
    max-width: 400px;
  }
</style>