var express =require('express');
var router = express.Router();
var ItemsModels = require('../models/items');
var fs = require('fs');

module.exports = router;
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