const env = process.env.NODE_ENV;
let MYSQL_CONF;
let REDIS_CONF;
// 开发环境
if(env === 'dev') {
    // sql
    MYSQL_CONF = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'myblog'
    }
    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

// 生产环境
if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}