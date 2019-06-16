var sqlMap = {
  user: {
    add: 'insert into user(name, password,grade,img) values ( ?, ?,0,?)',
    queryAll: 'SELECT * FROM user ',
    updateGrade: 'UPDATE user set grade = ? where name = ?',
    queryRank: 'SELECT * FROM user order by grade desc',
    updateImg: 'UPDATE user set img = ? where name = ?'
  }
}

module.exports = sqlMap