<template>
  <el-container style="background-color: wheat">
    <el-header class="head">
      2048小游戏
    </el-header>
    <el-container>
      <el-aside style=" width: 250px;" class="hidden-md-and-down">
        <el-container>
          <el-header class="ranktit">
            积分排行榜
          </el-header>
          <el-main class="rank">
            <el-table :data="getRank" style="width: 100%; height:200px;">
              <el-table-column prop="name" label="用户名" width="100">
              </el-table-column>
              <el-table-column prop="grade" label="积分" width="100">
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-aside>
      <el-main style="background-color: wheat">
        <el-container>
          <el-header>
            <el-row type="flex" justify="center">
              <el-col :md="4" :xs="8">
                <el-button type="primary" round @click="exit">退出</el-button>
              </el-col>
              <el-col :md="8" :xs="6">
                <el-button type="primary" round @click="reGame">重置</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-row style="margin-bottom: 15px" type="flex" justify="center">
              <el-col :md={span:4,pull:2} :xs="9">
                当前得分：{{getCurGrade}}
              </el-col>
              <el-col :md={span:4,pull:3} :xs="11">
                历史最佳：{{getGrade}}
              </el-col>
            </el-row>
            <el-row class="list" type="flex" justify="center" v-for="(items,index) in nums" :key="index">
              <el-col :md={span:1,pull:3} v-for="(item,index) in 4" :key="index" class="box"
                :class="['s'+items[item-1]]">{{items[item-1]}}
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <el-container class="hidden-sm-and-up" style="background-color: wheat;">
      <el-header class="ranktit">
        积分排行榜
      </el-header>
      <el-main class="rank">
        <el-table :data="getRank" style="width: 100%; height:200px;">
          <el-table-column prop="name" label="用户名" width="200">
          </el-table-column>
          <el-table-column prop="grade" label="积分" width="200">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import 'element-ui/lib/theme-chalk/display.css';

  export default {
    data() {
      return {
        nums: [
          ['', '', 2, ''],
          ['', '', '', ''],
          ['', 2, '', ''],
          ['', '', '', '']
        ],
        grade: '',
        curGrade: '',
        rank: []
      }
    },
    created() {
      document.addEventListener('keyup', this.handleKeyDown);
      this.updateRank();
    },
    methods: {
      exit() {
        this.$router.go(-1);
        sessionStorage.clear();
        this.$message.success('成功退出');
      },
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
        this.curGrade = 0;
        sessionStorage.setItem('curGrade', this.curGrade)
      },
      updateBestGrade() {
        var name = sessionStorage.getItem('user')
        var grade = parseInt(sessionStorage.getItem('grade'));

        this.$http.post('/api/user/update', {
          username: name,
          grade: grade
        }, {}).then((response) => {
          if (response.data.result.code == 1) {
            alert(response.data.result.msg);
          } else {
            alert(response.data.result.msg)
          }
        }).catch(() => {

        })
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
                sessionStorage.setItem('curGrade', this.curGrade)
                this.curGrade = parseInt(sessionStorage.getItem('curGrade')) + parseInt(newNum)
                if (this.curGrade > this.grade) {
                  this.grade = this.curGrade;
                  sessionStorage.setItem('grade', this.grade)
                  this.updateBestGrade()
                  this.updateRank()
                }
                sessionStorage.setItem('curGrade', this.curGrade)
                break;
              } else {
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
      },
      updateRank() {
        this.$http.post('/api/user/getRank', {}).then((response) => {
          if (response.data.result.code == 1) {
            //alert(response.data.result.msg);
            this.rank = response.data.data;
          } else {
            alert(response.data.result.msg)
          }
        }).catch(() => {

        })
      }
    },
    computed: {
      getGrade: {
        get() {
          return this.grade;
        },
        set() {
          this.grade = sessionStorage.getItem('grade')
        }
      },
      getCurGrade: {
        get() {
          return this.curGrade;
        },
        set() {
          this.curGrade = sessionStorage.getItem('curGrade')
        }
      },
      getRank: function () {
        return this.rank
      }
    },

  }
</script>

<style scoped>
  .head {
    margin: 0 auto;
    line-height: 60px;
    font-family: "Helvetica Neue";
    font-size: 20px;
    font-weight: bold;
  }

  .ranktit {
    text-align: center;
    font-family: "Helvetica Neue";
    font-size: 20px;
    font-weight: bold;
    line-height: 60px;
  }

  .box {
    text-align: center;
    height: 70px;
    width: 70px;
    line-height: 70px;
    border: 4px solid chocolate;
    font-family: "Helvetica Neue";
    font-size: 20px;
    font-weight: bold;
  }

  .s {
    background: #f0f0f0;
    box-shadow: inset 1px 1px 3px #929292;
  }

  .combin {
    z-index: 1;
    opacity: 0;
    transform: scale(0.1);
    border-radius: 50%;
    animation: fade 200ms ease;
  }

  .s2 {
    background: #f8f3e8;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
  }

  .s4 {
    background: #ede0c8;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
  }

  .s8 {
    color: #f9f6f2;
    background: #f2b179;
  }

  .s16 {
    color: #f9f6f2;
    background: #f59563;
  }

  .s32 {
    color: #f9f6f2;
    background: #f67c5f;
  }

  .s64 {
    color: #f9f6f2;
    background: #f65e3b;
  }

  .s128 {
    color: #f9f6f2;
    background: #edcf72;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.2381), inset 0 0 0 1px rgba(255, 255, 255, 0.14286);
  }

  .s256 {
    color: #f9f6f2;
    background: #edcc61;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746), inset 0 0 0 1px rgba(255, 255, 255, 0.19048);
  }

  .s512 {
    color: #f9f6f2;
    background: #edc850;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39683), inset 0 0 0 1px rgba(255, 255, 255, 0.2381);
  }

  .s1024 {
    color: #f9f6f2;
    background: #edc53f;
    font-size: 2em;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
  }

  .s2048 {
    color: #f9f6f2;
    background: #edc22e;
    font-size: 2em;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556), inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
  }

  .s4096 {
    color: #f9f6f2;
    background: #61c0ed;
    font-size: 2em;
    box-shadow: 0 0 30px 10px hsla(211, 84%, 70%, 0.45), inset 0 0 0 1px hsla(0, 0%, 100%, .33333);

  }
</style>