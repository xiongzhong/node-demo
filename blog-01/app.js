const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const {get, set} = require('./src/db/redis');
const { access } = require('./src/utils/log');
const getPostData = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            if (req.method !== "POST") {
                resolve({});
                return;
            }

            if (req.headers["content-type"] !== "application/json") {
                resolve({});
                return;
            }
            let postData = ''

            req.on('data', chuck => {
                postData += chuck.toString()
            })
            req.on('end', () => {
                if (postData) {
                    resolve(JSON.parse(postData))
                } else {
                    resolve({})
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
function getExpires() {
    let date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    return date.toGMTString()
}
const session = {}
function handleServe(req, res) {
    res.setHeader('Content-type', 'application/json')

    // 写入访问日志

    access(`${Date.now()} -- ${req.method} -- ${req.url} -- ${req.headers['user-agent']}`)
    // process.env.NODE_ENV
    // 处理路径
    let url = req.url;
    req.path = url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    const cookieStr = req.headers.cookie || '';
    req.cookie = cookieStr.split(';').reduce((result, item) => {
        if (item) {
            let key = item.split('=')[0].trim()
            let value = item.split('=')[1].trim()
            return Object.assign(result, { [key]: value })
        } else {
            return Object.assign(result, {})
        }
    }, {})

    // 解析session 
    let userId = req.cookie.userId;
    let needSetCookie = false;
    /*
    if(userId) {
        if (!session[userId]) {
            session[userId] = {}
        } 
    } else {
        needSetCookie = true;
        userId = Date.now();
        session[userId] = {}
    }
    req.session = session[userId];
    */
    if (!userId) {
        userId = Date.now();
        needSetCookie = true;
        // 初始化 redis 中的 session
        set(userId, {})
    }
    // 获取session
    req.sessionId = userId;
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session
            set(userId, {});
            // 设置session
            req.session = {}
        } else {
            req.session = sessionData
        }
        return getPostData(req)
    }).then(postData => {
        req.body = postData;
        // 处理博客路由
        let blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; HttpOnly; expires=${getExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            }).catch(err => {console.log(err)
                res.end(JSON.stringify(err))
            })
            return;
        }
        
        // 处理用户路由
        let userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; HttpOnly; expires=${getExpires()}`)
                }
                res.end(JSON.stringify(userData));
            }).catch(err => {
                console.log('err is', err)
            })
            return;
        }

        res.writeHead(404, { "Content-type": 'text/plain' })
        res.write('404 Not Found\n')
        res.end()
    }).catch(err => {
        res.end(JSON.stringify(err));
    })
   
}

module.exports = handleServe;