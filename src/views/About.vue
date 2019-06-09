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
      <el-main style="background-color: gray">
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="6">
                <el-button type="primary" round @click="transArray">开始</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" round>重置</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-row type="flex" justify="certain" v-for="items in nums">
              <el-col :span="1" v-for="item in 4" class="box" v-model="nums">{{items[item-1]}}</el-col>
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
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16]
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
      }
    },
  }
</script>

<style scoped>
  .box {
    text-align: center;
    height: 40px;
    line-height: 40px
  }
</style>