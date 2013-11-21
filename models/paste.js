var mongodb = require('./db');

function Paste(paste){
  this.poster = paste.poster;
  this.content = paste.content;
  this.date = paste.date;
};

module.exports = Paste;


Paste.prototype.save = function(callback) {//存储用户信息
  //要存入数据库的用户文档
  var paste = {
      poster: this.poster,
      content: this.content,
      date: this.date
  };
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('pastebin', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //将用户数据插入 users 集合
      collection.insert(poster,{safe: true}, function(err, user){
        mongodb.close();
        callback(err, poster);//成功！返回插入的用户信息
      });
    });
  });
};

User.get = function(name, callback){//读取用户信息
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('pastebin', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找用户名 name 值为 name文档
      collection.findOne({
        poster: name
      },function(err, doc){
        mongodb.close();
        if(doc){
          var copy = new Paste(doc);
          callback(err, copy);//成功！返回查询的用户信息
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};