<template>
  <div class="settings-friend-link-box">
    <div class="friend-link-action-bar">
      <el-button type="primary" size="small" @click="showAddFriendLink">添加友情链接</el-button>
    </div>
    <div class="friend-link-list-bar">
      <el-table
          v-loading="loading"
          :data="links"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="200">
        </el-table-column>
        <el-table-column
            width="300"
            label="网站名称">
          <template slot-scope="scope">
            <a class="link-title" :href="scope.row.url" target="_blank">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
            label="logo"
            width="200">
          <template slot-scope="scope">
            <el-image :previewSrcList="[blog_constants.baseUrl + scope.row.logo]" :src="blog_constants.baseUrl + scope.row.logo" class="link-logo-image" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="order"
            label="排序"
            width="80">
        </el-table-column>
        <el-table-column
            label="状态"
            width="80">
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
    <div class="friend-link-dialog">
      <el-dialog
          :title="friendLinkEditTile"
          :visible.sync="editDialogShow"
          :show-close="false"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          width="500px">
        <div>
          <el-form label-width="100px" :model="link" size="small">
            <el-form-item label="网站名称">
              <el-input v-model="link.name"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input v-model="link.url"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="link.order" :min="1" :max="100" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="link.state" placeholder="请选择状态">
                <el-option label="不可用" value="0"></el-option>
                <el-option label="正常" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="logo">
              <div class="friend-link-logo-upload" @click="showLinkLogoDialog">
                <i class="el-icon-plus" v-if="link.logo === ''"></i>
                <el-image v-else :src="blog_constants.baseUrl + link.logo"></el-image>
              </div>

            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelHandleLink" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleLink" size="mini">{{ linkEditCommitText }}</el-button>
        </span>
      </el-dialog>

      <logo-upload field="file"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showLinkCutter"
                     :width="200"
                     :height="74"
                     url="/admin/image/friendlink"
                     img-format="png">
      </logo-upload>

      <el-dialog
          title="删除友情链接提示"
          :show-close="false"
          :visible.sync="deleteDialogShow"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          width="400px">
        <span>你确定要删除：{{deleteLinkName}} 这个友情链接吗？？？</span>
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
import logoUpload from 'vue-image-crop-upload/upload-2.vue';
export default {
  name: "friend-link.vue",
  components: {
    'logo-upload': logoUpload
  },
  data() {
    return{
      loading: false,
      links:[],
      friendLinkEditTile:'添加友情链接',
      linkEditCommitText:'添加',
      editDialogShow: false,
      showLinkCutter: false,
      link:{
        id:'',
        name:'',
        logo:'',
        order:1,
        state:'1',
        url:''
      },
      deleteDialogShow:false,
      deleteLinkName:'',
      deleteLinkId:'',
    }
  },
  mounted() {
    this.listLinks();
  },
  methods:{
    showLinkLogoDialog() {
      this.showLinkCutter = true;
    },
    cropUploadSuccess(response) {
      if (response.code === Api.success_code) {
        this.link.logo = '/portal/image/' + response.data.id;
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
    },
    cropUploadFail() {
      this.$message.error('图片上传失败');
    },
    showAddFriendLink(){
      this.editDialogShow = true;

    },
    cancelHandleLink(){
      this.editDialogShow = false;
      this.resetLink();
    },
    handleLink(){
      if (this.link.name === '') {
        this.$message.error('网站名称不为空');
        return;
      }
      if (this.link.logo === '') {
        this.$message.error('网站logo不能为空');
        return;
      }
      if (this.link.url === '') {
        this.$message.error('网站跳转链接不能为空');
        return;
      }
      if (this.link.id === '') {
        Api.postFriendLink(this.link).then(result => {
          if (result.code === Api.success_code) {
            this.$message.success(result.message);
            this.editDialogShow = false;
            this.resetLink();
            this.listLinks();
          } else {
            this.$message.error(result.message);
          }
        })
      } else {
        Api.updateFriendLink(this.link, this.link.id).then(result => {
          if (result.code === Api.success_code) {
            this.$message.success(result.message);
            this.editDialogShow = false;
            this.resetLink();
            this.listLinks();
          } else {
            this.$message.error(result.message);
          }
        })
      }

    },

    resetLink() {
      this.link = {
        id:'',
        name:'',
        logo:'',
        order:1,
        state:'1',
        url:''
      }
    },

    listLinks(){
      Api.listFriendLinks().then(result=> {
        if (result.code === Api.success_code) {
          this.links = result.data;
        } else {
          this.$message.error(result.message)
        }
      })
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd : hh:mm:ss')
    },
    edit(item) {
      this.link.id = item.id;
      this.link.name = item.name;
      this.link.url = item.url;
      this.link.logo = item.logo;
      this.link.order = item.order;
      this.link.state = item.state;
      this.editDialogShow = true;
      this.friendLinkEditTile = '修改友情链接';
      this.linkEditCommitText = '更新';
    },
    deleteItem(item){
      this.deleteLinkName = item.name;
      this.deleteLinkId = item.id;
      this.deleteDialogShow = true;
    },
    doDeleteItem() {
      Api.deleteFriendLink(this.deleteLinkId).then(result => {
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.listLinks();
          this.deleteDialogShow = false;
          this.deleteLinkName = '';
          this.deleteLinkId = '';
        } else {
          this.$message.error(result.message);
        }
      })
    }

  }
}
</script>

<style>
  .link-title {
    text-decoration: none;
  }
  .link-logo-image {
    width: 150px;
    height: 50px;
  }
  .friend-link-logo-upload{
    width: 100px;
    height: 37px;
    text-align: center;
    cursor: pointer;
    line-height: 37px;
    border: #dfdfdf dashed 1px;
  }
</style>