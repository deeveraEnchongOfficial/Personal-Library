/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {





    test("#example Test GET /api/books", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/books")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array");
          if (!res.body[0]) {
            done();
          }
          assert.property(
            res.body[0],
            "commentcount",
            "Book in array should contain commentcount"
          );
          assert.property(
            res.body[0],
            "title",
            "Books in array should contain title"
          );
          assert.property(
            res.body[0],
            "_id",
            "Book in array should contain _id"
          );
          done();
        });
    });
 

  suite('Routing tests', function() {

    // Store the id returned when a book is created
    let validId;

    suite('POST /api/books with title => create book object/expect book object',
      function() {

        test('Test POST /api/books with title', function(done) {
          chai.request(server)
            .post('/api/books')
            .send({
              title: 'Stranger in a Strange Land',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'Response should be an object');
              assert.property(res.body, 'title',
                'Books in array should contain title');
              assert.property(res.body, '_id',
                'Books in array should contain _id');
              validId = res.body._id;
              done();
            });
        });

        test('Test POST /api/books with no title given', function(done) {
          chai.request(server)
            .post('/api/books')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isString(res.text, 'response should be a string');
              assert.equal(res.text, 'missing required field title');
              done();
            });
        });

      });

    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount',
              'Books in array should contain commentcount');
            assert.property(res.body[0], 'title',
              'Books in array should contain title');
            assert.property(res.body[0], '_id',
              'Books in array should contain _id');
            done();
          });
      });

    });

    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        const invalidId = 'deadbeefdeadbeefdeadbeef';
        chai.request(server)
          .get(`/api/books/${invalidId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .get(`/api/books/${validId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments',
              'book object should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.property(res.body, 'title',
              'book object should contain title');
            assert.property(res.body, '_id',
              'book object should contain _id');
            done();
          });
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id',
      function() {

        test('Test POST /api/books/[id] with comment', function(done) {
          chai.request(server)
            .post(`/api/books/${validId}`)
            .send({
              comment: 'Can we grok this comment?',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'comments',
                'book object should contain comments');
              assert.isArray(res.body.comments, 'comments should be an array');
              assert.equal(res.body.comments[0], 'Can we grok this comment?');
              assert.property(res.body, 'title',
                'book object should contain title');
              assert.property(res.body, '_id',
                'book object should contain _id');
              done();
            });
        });

        test('Test POST /api/books/[id] without comment field', function(done) {
          chai.request(server)
            .post(`/api/books/${validId}`)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isString(res.text, 'response should be a string');
              assert.equal(res.text, 'missing required field comment');
              done();
            });
        });

        test('Test POST /api/books/[id] with comment, id not in db',
          function(done) {
            const invalidId = 'deadbeefdeadbeefdeadbeef';
            chai.request(server)
              .post(`/api/books/${invalidId}`)
              .send({
                comment: 'Can we grok this comment',
              })
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isString(res.text, 'response should be a string');
                assert.equal(res.text, 'no book exists');
                done();
              });
          });

      });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .delete(`/api/books/${validId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        const invalidId = 'deadbeefdeadbeefdeadbeef';
        chai.request(server)
          .delete(`/api/books/${invalidId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});