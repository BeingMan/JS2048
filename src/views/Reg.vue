<template>
  <el-container style="height: 600px">
    <el-header class="title">
      <el-row type="flex" justify="center">
        新用户注册
      </el-row>
    </el-header>
    <el-main style="margin: 0 auto">
      <el-row type="flex" justify="center" style="margin-top: 20%">
        <el-col :md="{span:20}" :xs="{span:16}">
          <el-upload
            class="avatar-uploader"
            action="/api/user/uploadPic"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 20%">
        <el-col :md="{span:20}" :xs="{span:16}">
          <el-input
            placeholder="请输入账号"
            type="text"
            name="username"
            v-model="userName"
          ></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 10%">
        <el-col :md="{span:20}" :xs="{span:16}">
          <el-input
            placeholder="请输入密码"
            show-password
            type="text"
            name="password"
            v-model="password"
          ></el-input>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row type="flex" justify="center" style="margin-top: -10%">
        <el-col :xs="{span:6,offset:0}" :md="{span:2}">
          <el-button type="primary" plain @click="cancel">取消</el-button>
        </el-col>
        <el-col :xs="{span:6,push:1}" :md="{span:2,push:1}">
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
        userName: "",
        password: "",
        centerDialogVisible: false,
        centerDialogContent: "",
        imageUrl: "",
        imgaeBlob: ""
      };
    },
    methods: {
      cancel() {
        this.$router.go(-1);
      },
      addUser() {
        var name = this.userName;
        var password = this.password;
        var img = this.imgaeBlob;

        if (!name || !password) {
          this.$message.warning("用户名或密码不能为空");
        } else {
          this.$http
            .post(
              "/api/user/register",
              {
                username: name,
                password: password,
                img: img
              },
              {}
            )
            .then(response => {
              if (response.data.isreg) {
                this.$message.success(response.data.result.msg);
                this.$router.go(-1);
              } else {
                this.$message.error(response.data.result.msg);
              }
            })
            .catch(() => {
              alert("出错了");
            });
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.imgaeBlob = res.imgName;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }

        return isJPG && isLt2M;
      },
      readBlobAsDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function(e) {
          callback(e.target.result);
        };
        a.readAsDataURL(blob);
      },
      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
          type: mime
        });
      }
    }
  };
</script>

<style scoped>
  .title {
    margin: 0 auto;
    line-height: 60px;
    font-family: "Helvetica Neue";
    font-size: 20px;
    font-weight: bold;
  }

  .avatar-uploader {
    text-align: center;
  }

  .avatar-uploader .el-icon-plus {
    border: 1px solid #979797;
    border-radius: 50px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-icon-plus:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50px;
    display: block;
  }
</style>
