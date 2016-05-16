"use strict"

var sqlHelper = require('../utils/sqlHelper');

module.exports = {
  UpdateToSql:updateToSql
}


function updateToSql(rows,inputConfig,cb){
    var results=[];
    
    goNext();
    function goNext(){
        if(rows.length>1){
            var row = rows.pop();
            if(!row[0]) {
                results.push({status:2, row:rows.length+1, content:'pid为空'});
                return goNext();
            }
            findOne(row[0],function(err,datas){
                if(err) {
                    console.log(err);
                    results.push({status:1, row:rows.length+1, content:'数据库处理失败'});
                    return goNext();
                }
                if(datas.length>0){
                    updateOne(row,inputConfig,function(err){
                        if(err) {
                            results.push({status:1, row:rows.length+1, content:'更新失败'});                            
                        }else{
                            results.push({status:0, row:rows.length+1, content:'更新成功'});
                        }                        
                        return goNext();
                    });
                } else {
                    results.push({status:2, row:rows.length+1, content:'pid未匹配到数据'});                           
                    return goNext();
                }
                
            });
        }else{
            cb(results);
        }        
    }        
}


function findOne(id,cb){
    var sqlQuery = "Select pid From dbo.bma_productstocks Where pid ="+id;
    sqlHelper.sql(sqlQuery,cb);
}



function updateOne(row,inputConfig,cb){
    
    sqlHelper.request(function(err,request){
        if(err) return cb(err);
        var queryStr = "Update dbo.bma_productstocks Set ";
        var inputStr =[];
        for(let key in inputConfig.selected){
            let input = inputConfig.selected[key];
            if(input.isUpdate){
                inputStr.push(key+"=@"+key);
                request.input(key,input.type,row[input.rowNum]);
            }            
        }
        queryStr += inputStr.join(',');
        queryStr+= " Where pid="+row[0];
        console.log(queryStr);
        request.query(queryStr,cb);
    });
    
    
}