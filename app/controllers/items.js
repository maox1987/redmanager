"use strict"

var express =require('express');
var router = express.Router();
var ItemsModels = require('../models/items');
var fs = require('fs');
var multer = require('multer');
var xlsx = require('node-xlsx');
var sqlHelper = require('../utils/sqlHelper');

module.exports = router;

var upload = multer({
    storage:multer.memoryStorage()
});
var path =__dirname;
var filePath = path+'/../../public/tmp/items/产品.xlsx';
router.get('/export',function(req,res,next){
    req.app.locals.title='数据导出';
    
    res.render('items/export',{
    }); 
});

router.post('/export/file',function(req,res,next){
    ItemsModels.GetFromDatabase()
        .then(function(rows){
            var buffer = ItemsModels.RowsToXlsx(rows);
            fs.writeFileSync(filePath, buffer, 'binary');
            return res.json({});
            //res.sendFile('产品表.xlsx',buffer);
        })
        .catch(function(err){
            return next(err);
        });
});

router.get('/export/file',function(req,res,next){
    /*fs.exists(filePath,function(exists){
        res.json({status:404});
    });
    fs.readFile(path+'/../../public/tmp/items/产品.xlsx',function(err,file){
        if(err){
            console.log(err);
        }
        else {
            console.log(file);
        }
    });
    res.download(path+'/../../public/tmp/items/产品.xlsx');
    ItemsModels.GetFromDatabase()
        .then(function(rows){
            var buffer = ItemsModels.RowsToXlsx(rows);
            var fileName=filePath+Date.now()+'.xlsx';
            fs.writeFileSync(fileName, buffer, 'binary');
            //return res.download(filePath);
            return res.sendFile(fileName,{});
        })
        .catch(function(err){
            return next(err);
        });*/
});





router.get('/import',function(req,res,next){
    var inputConfig = {
        selected:{
            'psn':{
                isUpdate:false,
                type:sqlHelper.mssql.Char, 
                rowNum:1
            },
            'name':{
                isUpdate:false,
                type:sqlHelper.mssql.NVarChar, 
                rowNum:2
            },
            'state':{
                isUpdate:false,
                type:sqlHelper.mssql.TinyInt,
                rowNum:3,
            },
            'shopprice':{
                isUpdate:false,
                type:sqlHelper.mssql.Decimal,
                rowNum:4,
            },
            'marketprice':{
                isUpdate:false,
                type:sqlHelper.mssql.Decimal,
                rowNum:5,
            },
            'costprice':{
                isUpdate:false,
                type:sqlHelper.mssql.Decimal,
                rowNum:6,
            },
            'showimg':{
                isUpdate:false,
                type:sqlHelper.mssql.NVarChar,
                rowNum:7,
            },
            'description':{
                isUpdate:false,
                type:sqlHelper.mssql.NText,
                rowNum:8
            }
        }
    };
    res.render('items/import',{
        title:'导入',
        inputs:inputConfig.selected
    });
});

router.post('/import/file',upload.single('excel'),function(req,res,next){
    //console.log(req.file);
    var obj = xlsx.parse(req.file.buffer);
    console.log(req.body);
    
    var inputConfig = {
        selected:{
            'psn':{
                isUpdate:false,
                type:sqlHelper.mssql.Char, 
                rowNum:1
            },
            'name':{
                isUpdate:false,
                type:sqlHelper.mssql.NVarChar, 
                rowNum:2
            },
            'state':{
                isUpdate:false,
                type:sqlHelper.mssql.TinyInt,
                rowNum:3,
            },
            'shopprice':{
                isUpdate:false,
                type:sqlHelper.mssql.Decimal,
                rowNum:4,
            },
            'marketprice':{
                isUpdate:false,
                type:sqlHelper.mssql.Decimal,
                rowNum:5,
            },
            'costprice':{
                isUpdate:false,
                type:sqlHelper.mssql.Decimal,
                rowNum:6,
            },
            'showimg':{
                isUpdate:false,
                type:sqlHelper.mssql.NVarChar,
                rowNum:7,
            },
            'description':{
                isUpdate:false,
                type:sqlHelper.mssql.NText,
                rowNum:8
            }
        }
    };
    for(let key in inputConfig.selected){
        if(req.body.input.indexOf(key)!=-1){
            inputConfig.selected[key].isUpdate=true;
        }else{
            inputConfig.selected[key].isUpdate=false;
        }
    }
    ItemsModels.UpdateToSql(obj[0].data,inputConfig,function(results){
        
        var errs=[];
        var successes=[];
        var empties=[];
        results.forEach(function(item){
            switch(item.status){
                case 2:
                empties.push(item);
                break;
                case 1:
                errs.push(item);
                break;
                case 0:
                successes.push(item);
                break;
            }
        });
        
        successes.forEach(function(item){
            console.log(item.row+':'+item.content);
        });
        errs.forEach(function(item){
            console.log(item.row+':'+item.content);
        });
        
        empties.forEach(function(item){
            console.log(item.row+':'+item.content);
        });
        
        console.log('total: '+results.length);
        console.log('success:'+successes.length);
        console.log('err:',+errs.length);
        console.log('empty:'+empties.length);
        console.log('end...');
        //console.log(results);
        res.render('items/import_result',{
            title:'导入结果',
            results:results,
            successes:successes,
            errs:errs,
            empties:empties
            
        });
    });
});



