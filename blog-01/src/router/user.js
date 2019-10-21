const { SuccessModel, ErrorModel } = require('../model/model');
const { checkLogin } = require('../controller/user');
const { set } = require('../db/redis')
const handleUserRouter = (req, res) => {
    let method = req.method;
   
    // 登录
    if (method === "POST" && req.path === "/api/user/login") {
        let { username, password } = req.body; 
        let result = checkLogin(username, password);
        return result.then(data => {
            if(data.username) {
                // 设置session
                req.session.username = data.username;
                req.session.realname = data.realname;
                // 同步到redis
                set(req.sessionId, req.session)
                return new SuccessModel(true, '登录成功')
            } else {
                return new ErrorModel(false, '登录失败')
            }
        }).catch(err => {
            return new ErrorModel(false, '登录失败')
        })
    }
    /*
    if(method === "GET" && req.path === '/api/user/logincheck') {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel(req.session.username))
        } else {
            return Promise.resolve(new ErrorModel(false, '尚未登录'))
        }
    }
    */
}

module.exports = handleUserRouter