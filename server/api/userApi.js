var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}

// 注册接口
router.post('/register', (req, res) => {
  var sql = $sql.user
  var params = req.body
  var _res = res
  conn.query(sql.queryAll, function (err, res) {
    var isExist = false
    if (res.length != 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].name == params.username) {
          isExist = true
        }
      }
    }
    var data = {}
    data.isreg = !isExist
    if (isExist) {
      data.result = {
        code: 1,
        msg: '用户名已存在，请重新输入'
      };
      jsonWrite(_res, data);
    } else {
      conn.query(sql.add, [params.username, params.password], function (err, res) {
        if (res) {
          data.result = {
            code: 200,
            msg: '注册成功'
          };
        } else {
          data.result = {
            code: -1,
            msg: '注册失败'
          };
        }
        jsonWrite(_res, data);
      })
    }
  })
})

// 登录接口
router.post('/login', (req, res) => {
  var sql = $sql.user
  var params = req.body
  var _res = res
  conn.query(sql.queryAll, function (err, res) {
    var isExist = false
    var data = {}
    if (res.length != 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].name == params.username && res[i].password == params.password) {
          isExist = true
          data.grade = res[i].grade
        }
      }
    }
    data.islogin = isExist;
    if (isExist) {
      data.result = {
        code: 1,
        msg: '登陆成功'
      };
      jsonWrite(_res, data);
    } else {
      data.result = {
        code: -1,
        msg: '用户名或密码错误'
      };
      jsonWrite(_res, data);
    }
  })
})

// 更新历史记录接口
router.post('/update', (req, res) => {
  var sql = $sql.user
  var params = req.body
  var _res = res
  conn.query(sql.updateGrade,[params.grade, params.username], function (err, res) {
    var data = {}
    if (res.changedRows!=0) {
      data.result = {
        code: 1,
        msg: '更新成功'
      };
      jsonWrite(_res, data);
    }else{
      data.result = {
        code: -1,
        msg: '更新错误'
      };
      jsonWrite(_res, data);
    }
  })
})

// 获取排行榜接口
router.post('/getRank', (req, res) => {
  var sql = $sql.user
  var params = req.body
  var _res = res
  conn.query(sql.queryRank, function (err, res) {
    var data = {}
    
    if(res.length<=10){
      data.data = []
      for(var i=0;i<res.length;i++){
        data.data.push(res[i])
      }
      
      data.result = {
        code: 1,
        msg: '获取成功'
      };
      jsonWrite(_res, data);
    }else{
      data.data = []
      for(var i=0;i<10;i++){
        data.data.push(res[i])
      }
      data.result = {
        code: 1,
        msg: '获取成功'
      };
      jsonWrite(_res, data);
    }
  })
})
module.exports = router