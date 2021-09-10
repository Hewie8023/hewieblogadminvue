<template>
  <div class="header-part clearfix">
    <div class="header-left-box float-left">
      <div class="header-logo">
        两小只的管理中心
      </div>
    </div>

    <div class="header-right-box float-right">
      <div class="header-user-info clearfix">
        <div class="header-user-avatar float-left">
          <img style="object-fit: cover" :src="blog_constants.baseUrl + avatar" />
        </div>
        <div class="header-user-username float-right">
          <el-dropdown @command="handleCommand">
            <span class="header-user-username-link">
              {{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '../api/api'
export default {
  name: "top-header.vue",
  data(){
    return{
      userName:'',
      avatar:''
    }
  },
  mounted() {
    this.userName = window.localStorage.getItem('userName');
    this.avatar = window.localStorage.getItem('avatar');
  },
  methods:{
    handleCommand(command){
      if (command === 'userInfo') {
        this.$router.push({
          path:'/settings/info'
        })
      } else if (command === 'logout') {
        Api.doLogout().then(result=>{
          if (result.code === Api.success_code) {
            this.$router.push({
              path:'/login'
            })
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
  .header-logo {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }

  .header-user-avatar img{
    height: 36px;
    width: 36px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .header-user-username .header-user-username-link{
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-left: 10px;
    vertical-align: middle;
    cursor: pointer;
  }
  .header-user-info{
    margin-right: 40px;
  }
</style>