var sqlMap = {
  user: {
    add: 'insert into user(name, password,grade) values ( ?, ?,0)',
    queryAll: 'SELECT * FROM user ',
    updateGrade : 'UPDATE user set grade = ? where name = ?',
    queryRank:'SELECT * FROM user order by grade desc'
  }
}

module.exports = sqlMap
