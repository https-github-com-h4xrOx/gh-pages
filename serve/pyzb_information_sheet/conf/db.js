/**
 * @description 储存配置
 */
const { isProd } = require('../utils/env')
let REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1',
    password: "j58ONGvIwvdATscXjhMR"
}
let MYSQL_CONF = {
    host: "127.0.0.1",
    user: 'root',
    password: '',
    port: 3306,
    database: "yzsheet",
    dialect: "mysql"
}
if (isProd) {
    let REDIS_CONF = {
        // 线上配置
        port: 6379,
        host: '127.0.0.1'
    }

    let MYSQL_CONF = {
        // 线上MySQL
        host: "47.112.121.253",
        user: 'root',
        password: 'root',
        port: 3306,
        database: "yzsheet",
        dialect: "mysql"
    }
}
module.exports = {
    REDIS_CONF,
    MYSQL_CONF
}