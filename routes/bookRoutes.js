/**
 * Created by acardev on 24/01/16.
 */

var express = require("express");

var routes = function(Book){
    // "/api" altındaki ilk linkimiz json veriyor /api/books verieln parametre ile filtreliyor
    var bookRouter = express.Router();

    bookRouter.route('/books')
        .post(function(req, res){
            var bookData = new Book(req.query);
            bookData.save(function (err) {
                if (err) return handleError(err);
                else res.status(200).send(bookData);
            });
        })
        .get(function(req, res){

            var query = req.query;
            Book.find(query, function(err, books){
                if(err)
                    res.status(500).send("hata");
                else
                    res.json(books);
            });
        });
    //middleware kitabı haxır ediyor
    bookRouter.use('/books/:bookId',function(req, res, next){
        var query = req.params.bookId;
        console.log(query);
        Book.findById(query, function(err, book){
            if(err)
                res.status(500).json(err);
            else if(book){
                req.book = book;
                next();
            } else
                res.status(404).json("no book found");
        });
    });
// idye göre filtreleme,güncelleme vs vs
    bookRouter.route('/books/:bookId')
        .get(function(req, res){
            res.json(req.book);
    })
        .put(function(req, res){
            req.book.title = req.query.title;
            req.book.author = req.query.author;
            req.book.genre = req.query.genre;
            req.book.read = req.query.read;

            req.book.save(function(err){
                if(err)
                    res.status(500).json(err);
                else
                    res.json(req.book);
            });

        })
        .patch(function(req, res){
            if(req.query._id)
                delete req.query._id;

            for(var p in req.query){
                req.book[p] = req.query[p];
            }

            req.book.save(function(err){
                if(err)
                    res.status(500).json(err);
                else
                    res.json(req.book);
            });

        })
        .delete(function(req, res){
            req.book.remove(function(err){
                if(err)
                    res.status(500).json(err);
                else
                    res.status(200).json("removed");
            });
        });

    return bookRouter;
};

module.exports = routes;