<template>
  <div>
    <el-container>
      <el-header id="admin-header-box">
        <topHeader></topHeader>
      </el-header>
      <el-container class="main-container">
        <el-aside id="left-menu-list-box" width="220px">
          <leftMenu></leftMenu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>

</template>

<script>
export default {
  name: "base.vue",
  mounted() {
    //动态设置菜单高度
    //   let leftMenuBox = document.getElementById('left-menu-list-box');
    //   let adminHeaderBox = document.getElementById('admin-header-box');
    //   if (leftMenuBox) {
    //     leftMenuBox.style.height = (window.innerHeight - adminHeaderBox.offsetHeight) + 'px';
    //   }
  },
}
</script>

<style>
  #left-menu-list-box .el-menu {
    border-right: none;
  }
  .el-header {
    background-color: #0084ff;
    line-height: 46px;
    height: 46px !important;
  }

  .el-aside {
    border-right: solid 1px #e6e6e6;
  }

  .el-main {
    padding: 0;
  }

  .main-container {
    position: absolute;
    top: 46px;
    width: 100%;
    bottom: 0;
  }

  #left-menu-list-box {

  }

</style>