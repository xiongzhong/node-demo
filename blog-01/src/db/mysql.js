const mysql = require('mysql');
const {MYSQL_CONF} = require('../config/db');

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF);


// 开始连接
con.connect();

// 统一执行sql语句

function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


module.exports = {
    exec
}