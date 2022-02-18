"use strict";

var Koa = require('koa');

var app = new Koa();

var views = require('koa-views');

var json = require('koa-json');

var onerror = require('koa-onerror');

var bodyparser = require('koa-bodyparser');

var logger = require('koa-logger');

var session = require('koa-generic-session'); //koa session加密依赖


var cors = require('koa2-cors'); //跨域


var koaJwt = require('koa-jwt'); //token依赖


var redisStore = require('koa-redis'); //koaredis依赖


var _require = require('./conf/db'),
    REDIS_CONF = _require.REDIS_CONF; //redis的基础设置


var _require2 = require('./conf/secretKeys'),
    SESSION_SECRET_KEY = _require2.SESSION_SECRET_KEY,
    JWT_SECRET_KEY = _require2.JWT_SECRET_KEY; //密钥
// 子路由引入


var index = require('./routes/index');

var users = require('./routes/users');

var customer = require('./routes/customer');

var userrelation = require('./routes/userrelation');

var Order = require('./routes/order');

var Task = require('./routes/task');

var Utils = require('./routes/utils');

var Yz = require('./routes/yz');

var Collection = require('./routes/collection');

var Source = require('./routes/source');

var Group = require('./routes/group');

var Integral = require('./routes/integral'); // const 
// error handler


onerror(app); // middlewares

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public')); //静态文件

app.use(require('koa-static')(__dirname + '/uploadFiles')); //静态文件
//跨域设置

app.use(cors({
  // 如果客户端要访问到服务端发过去的cookie必须加这两句
  // origin: 'http://api.pyzbapp.com',
  // origin: 'http://8.129.127.166:10086', //prod
  // origin: 'http://localhost:9527',
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(views(__dirname + '/views', {
  extension: 'pug'
})); // session 配置
// 

app.keys = [SESSION_SECRET_KEY];
app.use(session({
  key: 'ttwqeskeeat',
  // cookie name 默认是 koa.sid
  prefix: 'sklerajdajskl231:23djas*&ldk-jak+ls:',
  // redis key 的前缀 默认是koa:sess:
  cookie: {
    path: '/',
    httpOnly: true,
    //保证只能在server端更改
    maxAge: 8 * 60 * 60 * 1000 //ms  cookie8小时过期

  },
  // ttl: 24 * 60 * 60 * 1000,
  store: redisStore({
    all: "".concat(REDIS_CONF.host, ":").concat(REDIS_CONF.port)
  })
}));
app.use(koaJwt({
  secret: JWT_SECRET_KEY //加密

}).unless({
  path: [/^\/api\/users\/login/, /^\/api\/users\/code/, /^\/api\/utils\/upload/, /^\/api\/yz\/*/] // 在此数组中的api接口不需要beanery来验证

})); // routes

app.use(index.routes(), index.allowedMethods()); //子路由

app.use(users.routes(), users.allowedMethods()); //user子路由

app.use(customer.routes(), customer.allowedMethods()); //客户子路由

app.use(userrelation.routes(), userrelation.allowedMethods()); //customer子路由

app.use(Order.routes(), Order.allowedMethods()); //订单子路由

app.use(Task.routes(), Task.allowedMethods()); //任务子路由

app.use(Utils.routes(), Utils.allowedMethods()); //customer子路由

app.use(Yz.routes(), Yz.allowedMethods()); //有赞子路由

app.use(Collection.routes(), Collection.allowedMethods()); //填写收款方式子路由

app.use(Source.routes(), Source.allowedMethods()); //货品来源子路由

app.use(Group.routes(), Group.allowedMethods()); //分组路由

app.use(Integral.routes(), Integral.allowedMethods()); //有赞积分路由
// error-handling

app.on('error', function (err, ctx) {
  console.error('server error', err, ctx);
});
module.exports = app;