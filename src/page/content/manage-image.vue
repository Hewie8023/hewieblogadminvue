<template>
  <div>
    <div class="image-search-part">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input v-model="original" placeholder="请输入来源"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doImageSearch">查询</el-button>
          <el-button type="danger" @click="cleanSearch">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="image-list-box">
      <el-table
          v-loading="loading"
          :data="images"
          style="width: 100%">
        <el-table-column
            prop="id"
            label="ID"
            width="200">
        </el-table-column>
        <el-table-column
            label="图片">
          <template slot-scope="scope">
            <el-image fit="cover" :previewSrcList="[blog_constants.imageBaseUrl + scope.row.url]" :src="blog_constants.imageBaseUrl + scope.row.url" class="image-manager-item"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="contentType"
            label="图片类型"
            width="140">
        </el-table-column>
        <el-table-column
            label="源"
            width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.original==='loop'">
              <el-tag type="danger" size="small">轮播图(loop)</el-tag>
            </div>
            <div v-if="scope.row.original==='article'">
              <el-tag type="primary" size="small">文章(article)</el-tag>
            </div>
            <div v-if="scope.row.original==='friendlink'">
              <el-tag type="warning" size="small">友情链接(friendlink)</el-tag>
            </div>
            <div v-if="scope.row.original==='avatar'">
              <el-tag type="success" size="small">头像(avatar)</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            width="65">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='0'">
              <el-tag type="danger" size="small">删除</el-tag>
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
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="image-page-navigation">
      <el-pagination
          class="image-page-navigation-bar"
          background
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div class="image-dialog-part">
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="500px">
        <span>你确定要删除: {{deleteMessage}} 这张图片吗？</span>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteDialogShow = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="doDeleteItem" size="mini">确 定</el-button>
                </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
import * as dateUtils from '../../utils/date'
export default {
  name: "manage-image.vue",
  data(){
    return{
      images:[],
      loading:false,
      pageNavigation: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 30,
      },
      original:'',
      deleteDialogShow:false,
      deleteMessage:'',
      deleteImageId:''

    }
  },
  methods:{
    listImages(){
      this.loading = true;
      Api.listImages(this.pageNavigation.currentPage,this.pageNavigation.pageSize,this.original).then(result=>{
        if (result.code === Api.success_code) {
          this.images = result.data.content;
          this.pageNavigation.currentPage = result.data.number + 1;
          this.pageNavigation.totalCount = result.data.totalElements;
          this.pageNavigation.pageSize = result.data.size;
        }
        this.loading = false;
      })

    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listImages();
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd : hh:mm:ss')
    },
    doImageSearch(){
      this.listImages();
    },
    cleanSearch(){
      this.original = '';
      this.listImages();
    },
    deleteItem(item){
      this.deleteDialogShow = true;
      this.deleteMessage = item.name;
      this.deleteImageId = item.id;
    },
    doDeleteItem(){
      Api.deleteImage(this.deleteImageId).then(result=>{
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.deleteDialogShow = false;
          this.listImages();
        } else {
          this.$message.error(result.message);
        }
      })
    }
  },
  mounted() {
    this.listImages();
  },

}
</script>

<style>
.image-manager-item img{
  width: 120px;
  height: 76px;
}
</style>