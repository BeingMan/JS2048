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
                <el-button type="primary" round @click="transArray(3)">开始</el-button>
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
          [4, 8, 4,''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', '']
        ]
      }
    },
    created() {
      document.addEventListener('keyup', this.handleKeyDown);
    },
    methods: {
      transOne() {
        var newArray = this.nums[0].map(function (col, i) {
          return this.nums.map(function (row) {
            return row[i];
          })
        }, this);
        this.nums = newArray;
      },
      transTwo() {
        this.nums.forEach((elements, index) => {
          var newlist = new Array(4).fill('');
          elements.forEach((element, index) => {
            newlist[index] = elements[3 - index];
          })
          this.$set(this.nums, index, newlist);
        })
      },
      transArray(items) {
        switch (items) {
          case 1:
            this.transOne();
            break;
          case 2:
            this.transTwo();
            break;
          case 3:
            this.transOne();
            this.transTwo();
            break;
        }
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
      handleKeyDown(e) {
        const map = {
          37: 0,
          38: 1,
          39: 2,
          40: 3
        };
        if (!(e.keyCode in map)) return;
        this.handleTask(map[e.keyCode]);
      },
      handleTask(times) {
        this.moveBox(times);
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
      moveBox(times) {
        this.transArray(times);
        var oldArray = this.nums;
        var hasMoved = false;
        oldArray.forEach((elements, index) => {
          var newlist = elements;
          var Merges = new Array(4).fill(false);
          elements.forEach((element, index) => {
            var isMerge = false;
            var newIndex = index;
            var newNum = element;
            if (element == '') return;
            for (var i = index - 1; i >= 0; i--) {
              if (newlist[i] === '') {
                newlist[newIndex] = '';
                newIndex = i;
                hasMoved = true;
              } else if (Merges[i]) {
                break;
              } else if (newlist[i] == element) {
                newlist[newIndex] = '';
                newNum = 2 * element;
                newIndex = i;
                isMerge = true;
                hasMoved = true;
                break;
              }else{
                break;
              }
            }
            Merges[newIndex] = isMerge;
            newlist[newIndex] = newNum;
          })
          this.$set(this.nums, index, newlist);
        });
        if (hasMoved) {
          this.randomAdd();
        }
        if (times == 3) {
          for (var i = 1; i <= 3; i++) this.transArray(times);
        } else {
          this.transArray(times);
        }
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