
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format
    , ObjectID = require('mongodb').ObjectID;;    

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',function(req,res){
  console.log('request for index page!');
  res.render('index');
});

app.get('/:id', function(req,res){
    var uid = req.params.id;
    try{
      MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
      var collection = db.collection('pastebin');
      collection.findOne({_id: new ObjectID(uid)},function(err,doc){
        if(err)  throw err;
        db.close();
        if(doc!=null && doc!='')  {
          res.render('show',{poster:doc['poster'],syntax:doc['syntax'],content:doc['content']});
        }  else  {
          res.render('index');
        }
      });
    });
    } catch(error) {
      console("Error");
      res.render('index');
    }
});

app.post('/paste',function(req,res){
	var poster = req.body.poster,
	content=req.body.content,
  syntax = req.body.syntax;
  var resultid;
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    var collection = db.collection('pastebin');
    console.log(poster+content+syntax);
    collection.insert({poster:poster,syntax:syntax,content:content,date:new Date()},function(err,doc){
      if(err) throw err;
      resultid = doc[0]['_id'];
      db.close();
      console.log('outer ID:'+resultid);
      res.render('result',{result:(resultid!=null?resultid:'fail')});
    });    
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
