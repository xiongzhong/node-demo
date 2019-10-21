const redis = require('redis');
const {REDIS_CONF} = require('../config/db');
let redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

redisClient.on('error', err => {
    console.error(err);
})


function set(key, value) {
    if (typeof value === 'object') {
        redisClient.set(key, JSON.stringify(value), redis.print)
    } else {
        redisClient.set(key, value, redis.print)
    }
    
}

function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err)
            } else {
                try {
                    resolve(JSON.parse(value))
                } catch (error) {
                    resolve(value)
                }
            }
            // redisClient.quit() 退出
        })
    })
}

module.exports = {
    set,
    get
}