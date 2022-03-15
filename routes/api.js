/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../models").Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, data) => {
        if(!data){
          res.json([]);
        }else{
          const formatData = data.map((book) => {
            return {
              _id:  book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length,
            }
          })
          res.json(formatData);
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      const newBook = new Book({ title, comments: [] });
      newBook.save((err, data) => {
        if (err || !data){
          res.send("there was an error saving");
        }else{
          res.json({ _id: data._id, title: data.title });
        }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.remove({}, (err, data) => {
        if (err || !data) {
          res.send("error");
        } else {
          res.send("complete delete successful");
        }
      });
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, data) => {
        if (!data) {
          res.send("no book exists");
        } else {
          res.json({
            comments: data.comments,
            _id: data._id,
            title: data.title,
            commentcount: data.comments.length,
          });
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        res.send("missing required field comment");
        return;
      }
      Book.findById(bookid, (err, bookdata) => {
        if(!bookdata){
          res.send('no book exists');
        }else{
          bookdata.comments.push(comment);
          bookdata.save((err, saveData) => {
            res.json({
              comments: saveData.comments,
              _id: saveData._id,
              title: saveData.title,
              commentcount: saveData.comments.length,
            });
          })
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      });
    });
  
};
