"use strict"

var sqlHelper = require('../utils/sqlHelper');
var xlsx = require('node-xlsx');
var fs = require('fs');

module.exports ={
  GetFromDatabase:function(){
    var queryStr = "Select  * From dbo.bma_products";
    return sqlHelper.query(queryStr);
  },
  RowsToXlsx:rowsToExcel,
  UpdateToSql:updateToSql
  
}

function rowsToExcel(rows){
  var data =[];
  if(rows.length){
    var keys=[];
    for(let key in rows[0]){
      keys.push(key);
    }
    data.push(keys);
  }else{
    return ;
  }
  rows.forEach(function(row){
    var values=[];
    for(let i=0;i<data[0].length;i++){
      values.push(row[data[0][i]]);
    }
    data.push(values);
  });
  var buffer = xlsx.build([{name: "mySheetName", data: data}]);
  return buffer;
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
    var sqlQuery = "Select pid From dbo.bma_products Where pid ="+id;
    sqlHelper.sql(sqlQuery,cb);
}



function updateOne(row,inputConfig,cb){
    /*var sqlQuery = "Update dbo.bma_products \
                    Set name='"+row[1]+"',\
                    shopprice='"+row[2]+"',\
                    marketprice='"+row[3]+"',\
                    showimg='"+row[4]+"' \
                    Where pid="+row[0];*/
    sqlHelper.request(function(err,request){
        if(err) return cb(err);
        var queryStr = "Update dbo.bma_products Set ";
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

