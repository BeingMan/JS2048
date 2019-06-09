<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="6" :offset="11">
          2048
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside style="background-color: aqua">
        <el-container>
          <el-header>
            排行榜标题
          </el-header>
          <el-main>
            排行榜内容
          </el-main>
        </el-container>
      </el-aside>
      <el-main style="background-color: wheat">
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="6">
                <el-button type="primary" round @click="transArray">开始</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" round @click="randomAdd">重置</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-row type="flex" justify="certain" v-for="items in changeNums">
              <el-col :span="1" v-for="item in 4" class="box">{{items[item-1]}}</el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    data() {
      return {
        nums: [
          [2, 2, 4, 4],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      }
    },
    methods: {
      transArray() {
        var newArray = this.nums[0].map(function (col, i) {
          return this.nums.map(function (row) {
            return row[i];
          })
        }, this);
        this.nums = newArray;
      },
      randomAdd() {
        var add = false;
        var x, y;
        while (!add) {
          x = Math.round(3 * Math.random());
          y = Math.round(3 * Math.random());
          console.log("x:" + x + "y:" + y);
          if (this.nums[x][y] === '') {
            add = true;
            this.$set(this.nums[x], y, Math.random() > 0.9 ? 4 : 2);
            console.log(this.nums);
          }
        }
      }
    },
    computed: {
      changeNums() {
        return this.nums;
      }
    }
  }
</script>

<style scoped>
  .box {
    text-align: center;
    height: 70px;
    width: 70px;
    line-height: 70px;
    border: 4px solid chocolate;
  }
</style>