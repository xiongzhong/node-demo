const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if(author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%'`
    }
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select id, author, title, content, createtime from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    let { title, content, author, createtime} = blogData;
    const sql = `insert into blogs (title, content, author, createtime) values ('${title}', '${content}', '${author}', ${createtime})`
    /**
     * insertData对象包含以下属性
     * "fieldCount": 0,
     * "affectedRows": 1,
     * "insertId": 1,
     * "serverStatus": 2,
     * "warningCount": 0,
     * "message": "",
     * "protocol41": true,
     * "changedRows": 0
     */
    return exec(sql).then(insertData => {
        return insertData.insertId > 0
    })
}

const blogUpdate = (id, blogData = {}) => {
    let { title, content } = blogData;
    const sql = `update blogs set title='${title}', content='${content}' where id='${id}'`
    return exec(sql).then(updateData => {
        return updateData.affectedRows > 0
    })
}

const deleteBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    return exec(sql).then(deleteData => {
        return deleteData.affectedRows > 0
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    blogUpdate,
    deleteBlog
}