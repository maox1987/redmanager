

module.exports = {
    port:normalizePort(process.env.PORT || '8080'),
    mongodb:{
        connectStr:'mongodb://192.168.19.34/redbag' //测试服务器
    },
    session:{
        name:'sid',
        secret:'recommand',
        cookie:{
            maxAge:10*60*1000
        }
    },
    mssql:{
        user:'nodejs',
        password:'abc@163!',
        server:'192.168.19.222',
        database:'brnmall',
        pool:{
            max:5,
            min:0,
            idleTimeoutMillis:30000
        }
    }
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}