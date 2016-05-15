var express =require('express');
var router = express.Router();

module.exports = router;


router.get('/export',function(req,res,next){
    
    res.render('items/export',{
        title:'数据导出',
    }); 
});