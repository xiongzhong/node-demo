const {SuccessModel, ErrorModel} = require('../model/model');
const { getList, getDetail, newBlog, blogUpdate, deleteBlog} = require('../controller/blog');

const loginVerify = function(req) {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel(false, '尚未登录'))
    }
}
const handleBlogRouter = (req, res) => {
    let method = req.method;
    let id = req.query.id;
    // 获取博客列表
    if (method === "GET" && req.path === "/api/blog/list") {
        let author = req.query.author || '';
        let keyword = req.query.keyword || '';
        return getList(author, keyword).then(data => {
            return new SuccessModel(data, '操作成功')
        }).catch(err => {
            return new ErrorModel(err)
        });
    }

    // 获取博客详情
    if (method === "GET" && req.path === "/api/blog/detail") {
        return getDetail(id).then(data => {
            return new SuccessModel(data, '操作成功')
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    // 添加博客
    if (method === "POST" && req.path === "/api/blog/new") {
        let loginResult = loginVerify(req);
        if (loginResult) {
            return loginResult
        }
        req.body.author = req.session.realname;
        req.body.createtime = Date.now()
        return newBlog(req.body).then(inserData => {
            return new SuccessModel(inserData, '操作成功')
        }).catch(err => {
            return new ErrorModel(err)
        });
       
    }

    // 修改博客
    if (method === "POST" && req.path === "/api/blog/update") {
        let loginResult = loginVerify(req);
        if (loginResult) {
            return loginResult
        }
        return blogUpdate(id, req.body).then(result => {
            return new SuccessModel(result, '操作成功')
        }).catch(err => {
            return new ErrorModel('操作失败')
        })
    }

    // 删除博客
    if (method === "POST" && req.path === "/api/blog/delete") {
        let loginResult = loginVerify(req);
        if (loginResult) {
            return loginResult
        }
        let author = req.session.realname;
        return deleteBlog(id, author).then(result => {
            return new SuccessModel(result, '操作成功')
        }).catch(err => {
            return new ErrorModel('操作失败')
        })
    }
}

module.exports = handleBlogRouter