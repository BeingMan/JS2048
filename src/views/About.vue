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
                <el-button type="primary" round @click="moveBox">开始</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" round @click="reGame">重置</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-row type="flex" justify="certain" v-for="items in nums">
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
          [2, 2, 4, 4],
          [2, 2, 4, 4],
          [2, 2, 4, 4]
        ]
      }
    },
    created() {
      document.addEventListener('keyup', function (e) {
        const map = {
          37: 0,
          38: 3,
          39: 2,
          40: 1
        };
        if (!(e.keyCode in map)) return;
        this.handleMove(map[e.keyCode]);
      })
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
          if (this.nums[x][y] === '') {
            add = true;
            this.$set(this.nums[x], y, Math.random() > 0.9 ? 4 : 2);
          }
        }
      },
      handleMove(times) {

      },
      reGame() {
        var arr = new Array();
        for (var x = 0; x < 4; x++) {
          arr[x] = new Array();
          for (var y = 0; y < 4; y++) {
            arr[x][y] = '';
          }
        }
        this.nums = arr;
        for (var i = 0; i < 2; i++) {
          this.randomAdd();
        }
      },
      moveBox() {
        var oldArray = this.nums;
        var newArray = [];
        var _this = this;
        oldArray.forEach((elements,index) => {
          var newlist = elements;
          var Merges = new Array(4).fill(false);
          elements.forEach((element, index) => {
            var isMerge = false;
            var newIndex = index;
            var newNum = element;
            for (var i = index-1; i >=0 ; i--) {
              if(newlist[i]===''){
                newlist[newIndex] = '';
                newIndex = i;
              }else if(Merges[i]){
                break;
              }else{
                newlist[newIndex] = '';
                newNum = 2*element;
                newIndex = i;
                isMerge = true;
                break;
              }
            }
            Merges[newIndex] = isMerge;
            newlist[newIndex] =newNum;
          })
          this.$set(this.nums,index,newlist);
        });
       
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