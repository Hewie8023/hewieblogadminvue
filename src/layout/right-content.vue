<template>
  <div class="right-box">
    <div class="content-title-box" v-text="$route.name"></div>
      <div class="content-box">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
export default {
  name: "right-content.vue",

}
</script>

<style>
  .content-title-box {
    padding: 10px;
    font-size: 20px;
    line-height: 30px;
    font-weight: 500;
    color: #909090;
  }
  .right-box {
    min-width: 1140px;
  }
</style>