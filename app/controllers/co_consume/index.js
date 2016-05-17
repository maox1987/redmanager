"use strict"

var express =require('express');
var router = express.Router();

module.exports = router;

var viewPath = 'co_consume/';

router.get('/',function(req,res,next){
  req.app.locals.title = '营销系统';
  res.render(viewPath+'index');
});


router.get('/items', function(req,res,next) {
  req.app.locals.title = '商品管理';
  res.render(viewPath+'items'); 
});


router.get('/orders', function(req,res,next) {
  req.app.locals.title = '订单管理';
  res.render(viewPath+'orders'); 
});

router.get('/takecash', function(req,res,next) {
  req.app.locals.title = '提现管理';
  res.render(viewPath+'takecash'); 
});


router.get('/verify', function(req,res,next) {
  req.app.locals.title = '审核管理';
  res.render(viewPath+'verify'); 
});


router.get('/partners', function(req,res,next) {
  req.app.locals.title = '代理管理';
  res.render(viewPath+'partners'); 
});