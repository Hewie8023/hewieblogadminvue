<template>
  <div class="loop-box">
    <div class="loop-action-box">
      <el-button type="primary" size="small" @click="showAddLoop">添加轮播图</el-button>
    </div>
    <div class="loop-list-box">
      <el-table
          v-loading="loading"
          :data="loops"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="200">
        </el-table-column>
        <el-table-column
            width="300"
            label="轮播图标题">
          <template slot-scope="scope">
            <a class="loop-title" :href="scope.row.targetUrl" target="_blank">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column
            label="轮播图"
            width="200">
          <template slot-scope="scope">
            <el-image :previewSrcList="[blog_constants.baseUrl + scope.row.imageUrl]" :src="blog_constants.baseUrl + scope.row.imageUrl" class="loop-image" :fit="fit"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="order"
            label="排序"
            width="65">
        </el-table-column>
        <el-table-column
            label="状态"
            width="65">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='0'">
              <el-tag type="danger" size="small">不可用</el-tag>
            </div>
            <div v-if="scope.row.state==='1'">
              <el-tag type="success" size="small">正常</el-tag>
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
            width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="loop-dialog-box">

      <el-dialog
          title="删除轮播图提示"
          :show-close="false"
          :visible.sync="deleteDialogShow"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          width="400px">
        <span>你确定要删除：{{deleteImageName}} 这张轮播图吗？？？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="doDeleteItem" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
          :title="loopEditTile"
          :visible.sync="editDialogShow"
          :show-close="false"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          width="500px">
        <div>
          <el-form label-width="100px" :model="loop" size="small">
            <el-form-item label="轮播图标题">
              <el-input v-model="loop.title"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input v-model="loop.targetUrl"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="loop.order" :min="1" :max="100" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="loop.state" placeholder="请选择状态">
                <el-option label="不可用" value="0"></el-option>
                <el-option label="正常" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload
                  class="upload-loop-img"
                  action="/admin/image/loop"
                  :show-file-list="false"
                  :on-success="handleLoopSuccess"
                  :before-upload="beforeLoopUpload">
                <el-image v-if="loop.imageUrl !== ''" :src="blog_constants.baseUrl + loop.imageUrl" class="loop-img" fit="cover"></el-image>
                <i v-else class="el-icon-plus loop-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelHandleLoop" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleLoop" size="mini">{{ loopEditCommitText }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
import * as dateUtils from '../../utils/date'
export default {
  name: "loop.vue",
  data() {
    return {
      loading: false,
      loops: [],
      fit: "contain",
      loopEditTile: '添加轮播图',
      editDialogShow: false,
      loopEditCommitText:'添 加',
      deleteDialogShow: false,
      deleteImageName: '',
      loop: {
        id:'',
        title:'',
        order:1,
        state:"1",
        targetUrl:'',
        imageUrl:'',
      },
      deleteLoopId:''
    }
  },
  methods: {
    doDeleteItem() {
      Api.deleteLoop(this.deleteLoopId).then(result => {
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.listLoops();
          this.deleteDialogShow = false;
        } else {
          this.$message.error(result.message);
        }
      })
    },
    cancelHandleLoop() {
      this.editDialogShow = false;
      this.resetForm();
    },
    handleLoopSuccess(response){

      if (response.code === Api.success_code) {
        this.loop.imageUrl = '/portal/image/'+ response.data.id;
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
      }

    },
    beforeLoopUpload() {

    },
    showAddLoop() {
      this.editDialogShow = true;
      this.loopEditTile = "添加轮播图";
      this.loopEditCommitText = "添 加";
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd : hh:mm:ss')
    },
    deleteItem(item) {
      this.deleteDialogShow = true;
      this.deleteImageName = item.title;
      this.deleteLoopId = item.id;
    },
    edit(item) {
      this.editDialogShow = true;
      this.loopEditTile = "编辑轮播图";
      this.loopEditCommitText = "修 改";
      this.loop = {
        id:item.id,
        title:item.title,
        order:item.order,
        state:item.state,
        targetUrl:item.targetUrl,
        imageUrl:item.imageUrl,
      }
    },
    listLoops() {
      this.loading = true;
      Api.listLoops().then(result => {
        this.loading = false;
        this.loops = result.data;
      })
    },
    handleLoop() {
      if(this.loop.title === '') {
        this.$message.error('图片标题不能为空');
        return;
      }
      if(this.loop.targetUrl === '') {
        this.$message.error('图片跳转路径不能为空');
        return;
      }
      if(!this.loop.targetUrl.startsWith('http://') &&
          !this.loop.targetUrl.startsWith('https://')) {
        this.$message.error('图片跳转路径格式不正确');
        return;
      }
      if(this.loop.imageUrl === '') {
        this.$message.error('图片链接不能为空');
        return;
      }
      if (this.loop.id !== '') {
        Api.updateLoop(this.loop, this.loop.id).then(result => {
          if (result.code === Api.success_code) {
            this.$message.success(result.message);
            this.listLoops();
            this.editDialogShow = false;
            this.resetForm();
          } else {
            this.$message.error(result.message);
          }
        })
      } else {
        Api.postLoop(this.loop).then(result => {
          if (result.code === Api.success_code) {
            this.$message.success(result.message);
            this.listLoops();
            this.editDialogShow = false;
            this.resetForm();
          } else {
            this.$message.error(result.message);
          }
        })
      }
    },
    resetForm() {
      this.loop =  {
        id:'',
        title:'',
        order:1,
        state:"1",
        targetUrl:'',
        imageUrl:'',
      }
    }
  },
  mounted() {
    this.listLoops();
  }
}
</script>

<style>
  .loop-title {
    text-decoration: none;
  }
  .loop-image {
  }
  .loop-dialog-box .upload-loop-img .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
  }
  .loop-dialog-box .upload-loop-img .loop-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>