"use strict"

var itemsCtrl = require('./items');

module.exports = function(app){
    
    
    app.get('/',function(req,res,next){
        res.app.locals.title = '首页';
        res.render('index',{
        });
    });
    
    app.use('/items',itemsCtrl);    
}