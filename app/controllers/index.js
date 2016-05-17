"use strict"

var itemsCtrl = require('./items');
var coConsumeCtrl = require('./co_consume');

module.exports = function(app){
    
    app.use(function(req,res,next){
        app.locals.title = '洋货铺';
        next();
    });
    app.get('/',function(req,res,next){
        res.app.locals.title = '首页';
        res.render('index',{
        });
    });
    
    app.use('/items',itemsCtrl);    
    app.use('/co_consume', coConsumeCtrl);
}