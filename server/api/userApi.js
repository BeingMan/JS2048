/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var formidable = require('formidable');
var $sql = require('../sqlMap')
const path = require('path');
const fs = require('fs');

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
      conn.query(sql.add, [params.username, params.password, params.img], function (err, res) {
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
          data.img = res[i].img
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
  conn.query(sql.updateGrade, [params.grade, params.username], function (err, res) {
    var data = {}
    data.result = {
      code: 1,
      msg: '更新成功'
    };
    jsonWrite(_res, data);
  })
})

// 获取排行榜接口
router.post('/getRank', (req, res) => {
  var sql = $sql.user
  var _res = res
  conn.query(sql.queryRank, function (err, res) {
    var data = {}

    if (res.length <= 10) {
      data.data = []
      for (var i = 0; i < res.length; i++) {
        data.data.push(res[i])
      }

      data.result = {
        code: 1,
        msg: '获取成功'
      };
      jsonWrite(_res, data);
    } else {
      data.data = []
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < 10; i++) {
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

//上传图片
router.post('/uploadPic', (req, res) => {
  var _res = res
  let form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.keepExtensions = true;
  form.uploadDir = './img/';
  form.parse(req, (err, fields, files) => {
    if (err) {
      var data = {};
      data.result = {
        code: -1,
        msg: '上传失败'
      };
      jsonWrite(_res, data);
    }
    let date = (new Date()).getTime();
    let oldPath = files.file.path;
    let imgName = files.file.name;
    let newImgName = imgName.replace(/[^.]+/, `img_${date}`);
    let newPath = path.join(path.dirname(oldPath), newImgName);
    fs.rename(oldPath, newPath, err => {
      var data = {};
      if (err) {
        data.result = {
          code: -1,
          msg: '上传失败'
        };
        jsonWrite(_res, data);
      } else {
        data.path = newPath
        data.imgName = newImgName
        data.result = {
          code: 1,
          msg: '上传成功'
        };
        jsonWrite(_res, data);
      }
    })
  })
})

// 更新头像接口
router.post('/updateImg', (req, res) => {
  var sql = $sql.user
  var params = req.body
  var _res = res
  conn.query(sql.updateImg, [params.img, params.username], function (err, res) {
    var data = {}
    if (err) {
      data.result = {
        code: -1,
        msg: '更新失败'
      };
      jsonWrite(_res, data);
    } else {
      data.result = {
        code: 1,
        msg: '更新成功'
      };
      jsonWrite(_res, data);
    }
  })
})
module.exports = router