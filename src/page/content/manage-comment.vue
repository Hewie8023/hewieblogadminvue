<template>
  <div class="comment-list-box">
    <div>
      <el-table
          v-loading="loading"
          :data="comments"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="200">
        </el-table-column>
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
        <el-table-column
            label="状态"
            width="65">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='2'">
              <el-tag type="danger" size="small">置顶</el-tag>
            </div>
            <div v-if="scope.row.state==='1'">
              <el-tag type="primary" size="small">正常</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="180">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            label="更新日期"
            width="180">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="danger" size="mini"
                       @click="deleteItem(scope.row)">删除
            </el-button>
            <el-button type="success" v-if="scope.row.state==='2'" size="mini" @click="top(scope.row)">取消置顶
            </el-button>
            <el-button type="success" v-else size="mini" @click="top(scope.row)">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="comment-navigation-bar">
      <el-pagination
          class="comment-list-page-navigation-bar"
          background
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div>
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="500px">
        <span>你确定要删除: {{deleteMessage}} 这篇文章吗？</span>
        <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="deleteDialogShow = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="doDeleteItem">确 定</el-button>
                </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
import * as dateUtils from '../../utils/date'
export default {
  name: "manage-comment.vue",
  data(){
    return{
      comments:[],
      loading: false,
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
      },
      targetDeleteId:'',
      deleteDialogShow: false,
      deleteMessage: '',


    }
  },
  methods:{
    top(item){
      Api.topComment(item.id).then(result=>{
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      });
      this.listComments();
    },
    deleteItem(item){
      this.targetDeleteId = item.id;
      this.deleteDialogShow = true;
      this.deleteMessage = item.content;

    },
    doDeleteItem(){
      Api.deleteCommentById(this.targetDeleteId).then(result=>{
        if (result.code == Api.success_code) {
          this.$message.success(result.message);
          this.listComments();
          this.deleteDialogShow = false;
        } else {
          this.$message.success(result.message);
        }
      })

    },
    listComments(){
      this.loading = true;
      Api.listComments(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result=>{
        if (result.code === Api.success_code) {
          this.comments = result.data.content;
          this.pageNavigation.currentPage = result.data.number + 1;
          this.pageNavigation.totalCount = result.data.totalElements;
          this.pageNavigation.pageSize = result.data.size;
        } else {
          this.$message.error(result.message)
        }
        this.loading = false;
      });

    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd : hh:mm:ss')
    },
    onPageChange(page){
      this.pageNavigation.currentPage = page;
      this.listComments();
    }

  },
  mounted() {
    this.listComments();
  }
}
</script>

<style>
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

</style>