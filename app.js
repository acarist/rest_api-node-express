/**
 * Created by acardev on 24/01/16.
 * rest api ana dosyamız
 */

//body parser ekliyoruz
var bodyParser = require("body-parser");

//expressi ekliyoruz
var express = require("express");

//mongodb orm mongoose ekliyoruz
var mongoose = require("mongoose");

//veritabanımıza bağlanıyoruz
var db = mongoose.connect('mongodb://localhost/bookAPI');

//veritabanımızın kitap modelini ekliyoruz.
var Book = require('./models/bookModel');

//expressi init ediyoruz
var app = express();

//env atanmış port varsa kullanıyoruz yoksa 3000
var port = process.env.PORT || 3000;

//body parserı appimize ekliyoruz
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//express routr refere ediyoruz
var bookRouter = express.Router();

// "/api" altındaki linkleri bu router bizim handle edecek
bookRouter = require('./routes/bookRoutes')(Book);
app.use('/api', bookRouter);



//anasayfa
app.get('/',function(req, res){
    res.send("what did you mean?");

    var bookaa = new Book(req);

    bookaa.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });

});

//app.post('/addBook',function(req, res){
//
//    console.log(req.query);
//    var bookData = new Book(req.query);
//
//    bookData.save(function (err) {
//        if (err) return handleError(err);
//        else res.json({success: "success"});
//    });
//
//});

//port init
app.listen(port, function(){
   console.log("çalışılan port :  "+ port);
});