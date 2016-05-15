"use strict"

var sqlHelper = require('../utils/sqlHelper');
var xlsx = require('node-xlsx');
var fs = require('fs');

module.exports ={
  GetFromDatabase:function(){
    var queryStr = "Select  * From dbo.bma_products";
    return sqlHelper.query(queryStr);
  },
  RowsToXlsx:rowsToExcel
  
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

