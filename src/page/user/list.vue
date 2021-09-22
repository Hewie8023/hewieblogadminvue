<template>
  <div class="user-box">
    <div class="user-action-box">
      <el-form :inline="true" size="small">
        <el-form-item label="用户名">
          <el-input v-model="search.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="search.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜 索</el-button>
          <el-button type="danger" @click="cleanSearch">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-list-box margin-bottom-10">
      <el-table
          v-loading="loading"
          :data="userList"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="200">
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户名"
            width="120">
        </el-table-column>
        <el-table-column
            label="头像"
            width="60">
          <template slot-scope="scope">
            <el-avatar size="medium" :src="blog_constants.baseUrl + scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
            label="角色"
            width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.roles==='role_admin'">
              <el-tag type="danger" size="medium">管理员</el-tag>
            </div>
            <div v-if="scope.row.roles==='role_normal'">
              <el-tag type="success" size="medium">普通用户</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="email"
            label="用户邮箱"
            width="200">
        </el-table-column>
        <el-table-column
            label="签名"
            width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.sign">
              <span v-text="scope.row.sign"></span>
            </div>
            <div v-else>
              <span>这个人很懒，什么也没有写...</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='0'">
              <el-tag type="danger" size="medium">已删除</el-tag>
            </div>
            <div v-if="scope.row.state==='1'">
              <el-tag type="success" size="medium">&nbsp;正&nbsp;常&nbsp;</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            class="category-update-time"
            label="更新日期"
            width="200">
          <template slot-scope="scope">
             <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button type="danger" v-if="scope.row.status!=='0'" size="mini"
                       @click="deleteItem(scope.row)">删除
            </el-button>
            <el-button type="danger" v-if="scope.row.status==='0'" size="mini"
                       @click="deleteItem(scope.row)" disabled>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="user-navigation-bar clearfix">
      <el-pagination
          class="user-list-page-navigation-bar"
          background
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div class="user-list-dialog-box">
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>你确定要删除: {{deleteUserName}} 这个用户吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="doDeleteItem">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="密码重置"
          :visible.sync="resetPasswordShow"
          width="400px">
        <div class="reset-password-box">
          <div class="reset-tips-text">修改{{' "'+targetResetUserName+'”'}} 的密码</div>
          <el-form label-width="70px" size="medium">
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model="resetPasswordValue" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="danger" @click="resetPasswordShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="doResetPassword">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {hex_md5} from "../../utils/md5";
import * as Api from '../../api/api'
import * as dateUtils from '../../utils/date';
export default {
  name: "list.vue",
  data() {
    return {
      search: {
        userName: '',
        email: ''
      },
      loading: false,
      userList: [],
      pageNavigation: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 20,
      },
      deleteDialogShow: false,
      deleteUserName: '',
      targetDeleteUserId: '',
      resetPasswordShow: false,
      resetPasswordValue: '',
      targetResetUserName: '',
      targetResetUserId: ''
    }
  },
  methods: {
    doResetPassword() {
      //检查密码不为空.
      if (this.resetPasswordValue === '') {
        this.$message.error('新密码不可以为空.');
        return;
      }
      Api.resetPassword(this.targetResetUserId, hex_md5(this.resetPasswordValue)).then(result => {
        if (result.code === Api.success_code) {
          this.resetPasswordShow = false;
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    doDeleteItem() {
      //去删除用户
      Api.deleteUserById(this.targetDeleteUserId).then(result => {
        if (result.code === Api.success_code) {
          this.deleteDialogShow = false;
          //处理结果
          this.$message.success(result.message);
          this.listUsers();
        } else {
          this.$message.error(result.message);
        }
      })
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listUsers()
    },
    doSearch() {
      Api.doUserSearch(this.search.userName, this.search.email).then(result => {
        this.handleUserListResult(result);
      });
    },
    cleanSearch() {
      this.search.email = '';
      this.search.userName = '';
      this.listUsers();
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    deleteItem(item) {
      this.targetDeleteUserId = item.id;
      this.deleteUserName = item.userName;
      this.deleteDialogShow = true;
    },
    resetPassword(item) {
      this.resetPasswordShow = true;
      this.targetResetUserName = item.userName;
      this.targetResetUserId = item.id;
    },

    listUsers() {
      Api.listUsers(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result=> {
        this.handleUserListResult(result);
      });
      this.loading = true;
    },
    handleUserListResult(result) {
      if (result.code === Api.success_code) {
        this.userList = result.data.content;
        this.pageNavigation.currentPage = result.data.number + 1;
        this.pageNavigation.totalCount = result.data.totalElements;
        this.pageNavigation.pageSize = result.data.size;
      } else {
        this.$message.error(result.message);
      }
      //console.log(this.pageNavigation);
      this.loading = false;
    }
  },
  mounted() {
    this.listUsers();
  }

}
</script>

<style>


  .user-action-box .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
  .user-list-box {
    padding: 20px;
  }

  .reset-tips-text {
    margin-left: 15px;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .user-list-page-navigation-bar {
    margin-right: 50px;
    float: right;
  }
</style>