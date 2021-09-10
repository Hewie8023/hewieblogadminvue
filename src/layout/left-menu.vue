<template>
  <div>
    <el-menu
        :default-active="$route.path"
        :uniqueOpened="true"
        class="el-menu-vertical">

      <template v-for="(item, index) in menuList">
        <router-link :to="item.path"  v-if="!item.children && !item.hidden" :key="index">
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </router-link>

          <el-submenu :index="item.path" v-if="item.children && !item.hidden" :key="index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <router-link  :to="item.path+'/'+subItem.path" v-for="(subItem, subIndex) in item.children" :key="subIndex">
              <el-menu-item v-if="!subItem.hidden" :index="item.path+'/'+subItem.path" >
                <span>{{ subItem.name }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
      </template>

    </el-menu>
  </div>
</template>

<script>
import {routes} from '../router'
export default {
  data() {
    return {
      menuList: []
    }
  },
  mounted() {
    let menuList = routes[0];
    this.menuList = menuList.children;
  },
  name: "left-menu.vue"
}
</script>

<style>
  .el-menu-vertical a{
    text-decoration: none;
  }
</style>