var settings = require('../../config/settings');
var mssql = require('mssql');
var config =settings.mssql;

var connection = new mssql.Connection(config);
connection.connect();

exports.sql = function(SQL,cb){
    if(connection.connected){
        exec(SQL,cb);
    }else{
       connection.connect().then(function(){
            exec(SQL,cb);
        }).catch(function(err) {
            cb(err,null);
        }); 
    }    
};


 function exec(sql,cb){
    var request =new mssql.Request(connection);
    request.query(sql,function(err,recordset,affected) {
        if(err) return cb(err);
        cb(null,recordset,affected);
    });
}

exports.query = function(sql){
    if(connection.connected){
        return new mssql.Request(connection).query(sql);
    }else{
       return connection.connect().then(function(){
            return new mssql.Request(connection).query(sql);
       });
       
    }
};

