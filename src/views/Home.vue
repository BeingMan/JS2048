<template>
  <div class="home">
    <el-row>
      <el-col :span="24" :offset="11">2048小游戏</el-col>
    </el-row>
    <el-row>
      <el-col :span="4" :offset="10">
        <el-input placeholder="请输入账号" type="text" name="username" v-model="userName"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" :offset="10">
        <el-input placeholder="请输入密码" show-password type="text" name="password" v-model="password"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1" :offset="10">
        <el-button type="primary" plain>注册</el-button>
      </el-col>
      <el-col :span="1" :offset="2">
        <!-- <router-link to="/about"> -->
          <el-button type="primary" plain @click="addUser">登录</el-button>
        <!-- </router-link> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userName: '',
        password: ''
      }
    },
    methods: {
      addUser() {
        var name = this.userName
        var password = this.password
        this.$http.post('/api/user/addUser', {
          username: name,
          age: password
        }, {}).then((response) => {
          console.log(response)
          this.$router.push({path:'/about'});
        }).catch(()=>{
          
        })
      }
    }
  }
</script>