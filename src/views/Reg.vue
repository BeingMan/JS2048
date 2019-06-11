<template>
  <el-container style="height: 600px">
    <el-header class="title">
      <el-row type="flex" justify="center">
        新用户注册
      </el-row>
    </el-header>
    <el-main style="margin: 0 auto">
      <el-row type="flex" justify="center" style="margin-top: 80%">
        <el-col :md={span:20} :xs={span:16}>
          <el-input placeholder="请输入账号" type="text" name="username" v-model="userName"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 10%">
        <el-col :md={span:20} :xs={span:16}>
          <el-input placeholder="请输入密码" show-password type="text" name="password" v-model="password"></el-input>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row type="flex" justify="center" style="margin-top: -10%">
        <el-col :xs={span:6,offset:0} :md={span:2}>
          <el-button type="primary" plain @click="cancel">取消</el-button>
        </el-col>
        <el-col :xs={span:6,push:1} :md={span:2,push:1}>
          <el-button type="primary" plain @click="addUser">确认</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        userName: '',
        password: '',
        centerDialogVisible: false,
        centerDialogContent:''
      }
    },
    methods: {
      cancel() {
        this.$router.go(-1);
      },
      addUser() {
        var name = this.userName
        var password = this.password
        if(!name || !password){
          this.$message.warning('用户名或密码不能为空');
        }else{
          var _this = this;
        this.$http.post('/api/user/register', {
          username: name,
          password: password
        }, {}).then((response) => {
          if (response.data.isreg) {
            this.$message.success(response.data.result.msg);
            this.$router.go(-1);
          } else {
            this.$message.error(response.data.result.msg);
          }
        }).catch(() => {
          console.log("出错了")
        })
        }
      }
    }
  }
</script>

<style scoped>
  .title {
    margin: 0 auto;
    line-height: 60px;
    font-family: "Helvetica Neue";
    font-size: 20px;
    font-weight: bold;
  }
</style>