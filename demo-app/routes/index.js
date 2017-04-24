var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var db = require('monk')('localhost:27017/twitter_assignment');

db.then(() => {
  console.log('Connected correctly to server')
});

db = db.get('analytics_data');
var client = new Twitter({
    consumer_key: '5IGkTynxX0PslqJk60S8QEyRh',
    consumer_secret: 'bBfeag1NQXfLhjnzKYTAXiLG2DyI8zQbfJchaZ3DsFxaX7Nf6p',
    access_token_key: '1111698043-MzHnBURAYf0NoWVUPiH2hVe4GAesYXFYD4Jzx0h',
    access_token_secret: 'iX0ruqJuAiSZzsXzlDkGn0dGQDFqk4QkjBJihEhJ0niph'
 });
  
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("home", {title: "Demo App"});
});

router.post('/search_tweets', function(req, res, next) {
  search(req, res, next);
});

var search = function (req, res, next){
  var search_text = req.body;
  arr = [];
  db.find({$text: {$search: search_text.key}}).then(
    function (docs){
      docs.forEach(
          function (docs){
              docs.statuses.forEach(
                function (doc){ 
                    temparr = [doc.text, doc.created_at];
                    arr.push(temparr);
                }
              );
          }
     )
    res.send(arr);
   }
  );
}

router.get('/pull_tweets', function(req, res, next) {
  client.get('search/tweets', {q: 'analytics', count: 100}, function(error, tweets, response) {
    if(error == null){
      res.write("Please wait data will be import shortly. \n");
     insert_asynch_data(tweets, 0, res);
    }
    else{
      res.send(error);
    }
  });
});
// db.analytics_data.createIndex({"statuses.text":"text"})
router.post('/filter_tweets', function(req, res, next) {
  var params  = req.body, arr = [];
 // query = "{statuses.created_at\" :{$gte: "+params.start_date+" , $lte: "+params.end_date+"}}";
   db.find({"statuses.created_at" : {$gte: params.start_date , $lte: params.end_date}}).then(
    function (docs){
      docs.forEach(
          function (docs){
              docs.statuses.forEach(
                function (doc){ 
                    temparr = [doc.text, doc.created_at];
                    arr.push(temparr);
                }
              );
          }
     )
    res.send(arr);
   }
   );
});

var insert_asynch_data  = function (tweets, count, res){
      db.insert(tweets, function(err, r) {
            var maxx_id  = tweets.search_metadata,max_id;
            client.get('search/tweets', {q: 'analytics', count: 100, max_id: maxx_id}, function(error, tweets, response) {
              if(error == null){  
                count += 1;
                res.write("Data importing asynchronously...!!! Request number "+count+"\n");
                insert_asynch_data(tweets, count, res);
              }
              else{
                res.write("Data importing operation completed...!!!");
                res.end();
              }
            });
      });
}

module.exports = router;
