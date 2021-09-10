<template>
  <div class="category-box">
    <div class="category-action-box">
      <el-button type="primary" size="small" @click="showAddCategory">添加分类</el-button>
    </div>
    <div class="category-list-box">
      <el-table
          v-loading="loading"
          :data="categoryList"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="200">
        </el-table-column>
        <el-table-column
            prop="name"
            label="分类名称"
            width="160">
        </el-table-column>
        <el-table-column
            prop="pinyin"
            label="拼音"
            width="160">
        </el-table-column>
        <el-table-column
            prop="order"
            label="排序"
            width="65">
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述">
        </el-table-column>
        <el-table-column
            label="状态"
            width="65">
          <template slot-scope="scope">
            <div v-if="scope.row.status==='0'">
              <el-tag type="danger" size="small">删除</el-tag>
            </div>
            <div v-if="scope.row.status==='1'">
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
            <el-button type="danger" :disabled="scope.row.status==='0'" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="category-dialog-box">
      <el-dialog
          title="删除分类提示"
          :show-close="false"
          :visible.sync="deleteDialogShow"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          width="400px">
        <span>你确定要删除：{{deleteMsg}} 这个分类吗？？？</span>
          <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="doDeleteItem" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
          :title="editTitle"
          :visible.sync="editDialogVisible"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :show-close="false"
          width="500px">
        <div class="category-editor-box">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form  label-width="80px" size="small">
                <el-form-item label="分类名称">
                  <el-input v-model="category.name"></el-input>
                </el-form-item>
                <el-form-item label="拼音">
                  <el-input v-model="category.pinyin"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input type="textarea" :row="2" resize="none" maxlength="128" v-model="category.description"></el-input>
                </el-form-item>
                <el-form-item label="顺序">
                  <el-input-number v-model="category.order" :min="1" :max="100" label="描述文字"></el-input-number>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="category.status" placeholder="请选择分类状态">
                      <el-option label="删除" value="0"></el-option>
                      <el-option label="正常" value="1"></el-option>
                    </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddCategory" size="mini">取 消</el-button>
          <el-button type="primary" @click="addCategory" size="mini">{{editCommitText}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
import * as dateUtils from '../../utils/date'

export default {
  name: "category.vue",
  data() {
    return {
      loading: false,
      categoryList: [],
      deleteDialogShow: false,
      deleteMsg: '',
      deleteTargetId: '',
      editTitle: '编辑分类',
      editCommitText: '修改分类',
      editDialogVisible: false,
      category: {
        id:'',
        name:'',
        description:'',
        order:1,
        status:'1',
        pinyin:'',
      }
    }
  },
  methods: {
    edit(item) {
      this.editTitle = "修改分类";
      this.editCommitText = "修改分类";
      this.category = {
        id: item.id,
        name: item.name,
        pinyin: item.pinyin,
        description: item.description,
        order: item.order,
        status: item.status
      };
      this.editDialogVisible = true;
    },
    deleteItem(item) {
      this.deleteDialogShow = true;
      this.deleteMsg = item.name;
      this.deleteTargetId = item.id;
      //console.log(item)
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return dateUtils.formatDate(date, 'yyyy-MM-dd : hh:mm:ss')
    },
    doDeleteItem() {
      Api.deleteCategory(this.deleteTargetId).then(result => {
        if (result.code === Api.success_code) {
          this.$message({
            type: 'success',
            center: true,
            message: result.message,
          });
          this.listCategory();
        }
      });
      this.deleteDialogShow = false;
    },
    listCategory(){
      this.loading = true;
      Api.listCategory().then(result => {
        this.loading = false;
        if (result.code === Api.success_code) {
          this.categoryList = result.data;
        }
      })
    },
    showAddCategory() {
      this.editCommitText = "添加分类";
      this.editTitle = "添加分类";
      this.editDialogVisible = true;
    },
    addCategory() {
      if (this.category.name === '') {
        this.showWarning('分类名称不能为空');
        return;
      }
      if (this.category.pinyin === '') {
        this.showWarning('分类拼音不能为空');
        return;
      }
      if (this.category.description === '') {
        this.showWarning('分类描述不能为空');
        return;
      }
      if (this.category.status === '') {
        this.showWarning('分类状态不能为空');
        return;
      }
      if (this.category.id === '') {
        Api.postCategory(this.category).then(result => {
          if (result.code === Api.success_code) {
            this.showSuccess('添加成功');
            this.listCategory();
            // 重置数据
            this.resetDate();
          } else {
            this.showWarning(result.message);
          }
          this.editDialogVisible = false;
        });
      } else {
        Api.updateCategory(this.category, this.category.id).then(result => {
          //console.log(this.category);
          if (result.code === Api.success_code) {
            this.showSuccess(result.message);
            this.listCategory();
            // 重置数据
            this.resetDate();
          } else {
            this.showWarning(result.message);
          }
          this.editDialogVisible = false;
        });
      }
    },
    showWarning(msg) {
      this.$message({
        message:msg,
        type:"error",
        center: true,
      })
    },
    showSuccess(msg) {
      this.$message({
        message:msg,
        type:"success",
        center: true,
      })
    },
    resetDate() {
      this.category =  {
        id:'',
        name:'',
        description:'',
        order:1,
        status:'1',
        pinyin:'',
      }
    },
    cancelAddCategory() {
      this.editDialogVisible = false;
      this.resetDate();
    }
  },
  mounted() {
    //获取分类数据
    this.listCategory();
  }
}
</script>

<style>
  .el-dialog__footer {
    text-align: center;
  }

</style>