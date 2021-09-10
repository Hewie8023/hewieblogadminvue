<template>
  <div class="dashboard-box">
    <div class="welcome-tips">
      欢迎来到幸运的两小只的后台管理系统
    </div>
    <div class="website-info-box margin-bottom-10">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="web-site-info">
            <div class="web-site-info-title">
              访问总数
            </div>
            <div class="web-site-info-num">
              {{viewCount}}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="web-site-info">
            <div class="web-site-info-title">
              注册用户
            </div>
            <div class="web-site-info-num">
              {{ userCount }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="web-site-info">
            <div class="web-site-info-title">
              文章总数
            </div>
            <div class="web-site-info-num">
              {{ articleCount }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="web-site-info">
            <div class="web-site-info-title">
              评论总数
            </div>
            <div class="web-site-info-num">
              {{ commentCount }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="dashboard-bottom-part">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="card-title">快捷操作</span>
              </div>
              <div class="fast-operation-list">
                <div class="fast-operation-item">
                  <router-link class="el-icon-edit" to="/content/post-article">
                    写文章
                  </router-link>
                </div>
                <div class="fast-operation-item">
                  <router-link class="el-icon-refresh-right" to="/settings/website-info">
                    修改网站信息
                  </router-link>
                </div>
                <div class="fast-operation-item">
                  <router-link class="el-icon-paperclip" to="/settings/friend-link">
                    友情链接
                  </router-link>
                </div>
                <div class="fast-operation-item">
                  <router-link class="el-icon-tickets" to="/operation/category">
                    添加文章分类
                  </router-link>
                </div>
                <div class="fast-operation-item">
                  <router-link class="el-icon-picture-outline" to="/operation/loop">
                    轮播图管理
                  </router-link>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="card-title">最新评论</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toCommentManage">更多 >>> </el-button>
              </div>
              <div class="last-commnent">
                <el-table
                    v-loading="loading"
                    :data="comments"
                    style="width: 100%">
                  <el-table-column
                      label="评论内容">
                    <template slot-scope="scope">
                      <a href="#"> {{scope.row.content}} </a>
                    </template>
                  </el-table-column>
                  <el-table-column
                      label="用户"
                      width="200">
                    <template slot-scope="scope">
                      <a href="#" class="comment-user-info clearifx">
                        <el-avatar :src="scope.row.userAvatar"> </el-avatar>
                        <span class="comment-uername">{{scope.row.userName}}</span>
                      </a>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
export default {
  name: "index.vue",
  data(){
    return {
      userCount:'',
      commentCount:'',
      articleCount:'',
      viewCount:'',
      loading:false,
      comments:[],

    }
  },
  methods:{
    getCount(){
      Api.getArticleCount().then(result=>{
        if (result.code === Api.success_code) {
          this.articleCount = result.data;
        }
      });
      Api.getUserCount().then(result=>{
        if (result.code === Api.success_code) {
          this.userCount = result.data;
        }
      });
      Api.getViewCount().then(result=>{
        if (result.code === Api.success_code) {
          this.viewCount = result.data.website_view_count;
        }
      });
      Api.getCommentCount().then(result=>{
        if (result.code === Api.success_code) {
          this.commentCount = result.data;
        }
      })
    },
    toCommentManage(){
      this.$router.push({
        path:'/content/manage-comment'
      })
    },
    getLastComment(){
      this.loading = true;
      Api.listComments(1, 10).then(result=>{
        if (result.code === Api.success_code) {
          this.comments = result.data.content;
        } else {
          this.$message.error(result.message)
        }
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getCount();
    this.getLastComment();
  }
}
</script>

<style>
  .dashboard-box{
    padding: 20px;
    min-width: 1140px;
  }

  .web-site-info {
    height: 150px;
    box-shadow: 0 2px 10px #d4d4d4;
  }

  .web-site-info-title {
    padding: 20px;
    font-weight: 600;
    font-size: 18px;
    color: #909090;
  }
  .web-site-info-num{
    text-align: center;
    font-weight: 600;
    font-size: 25px;
    color: #0084ff;
  }
  .welcome-tips{
    padding: 20px;
    font-size: 20px;
    animation: marqueeTrans 10s linear infinite;
  }
  @keyframes marqueeTrans {
/*    0% {
      transform: translate(0,0);
    }
    50% {
      transform: translate(-20%,0);
    }
    100% {
      transform: translate(-40%, 0);
    }*/
    0% {margin-left: 880px}
    50% {margin-left: 250px}
    100% {margin-left: -380px}
  }

  .card-title{
    font-weight: 600;
    font-size: 18px;
    color: #909090;
  }
  .comment-user-info {
    display: block;
  }
  .comment-user-info span{
    display: block;
    float: left;
    line-height: 40px;
  }
  .comment-user-info img{
    vertical-align: middle;

  }
  .comment-uername{
    margin-left: 10px;
    font-weight: 600;
    color: #dfdfdf;
  }

  .fast-operation-list{

  }

  .fast-operation-item{
    padding: 10px;
    margin-bottom: 10px;
  }
  .fast-operation-item a{
    color: #00b0e8;
    font-size: 15px;
    font-weight: 400;
  }
</style>