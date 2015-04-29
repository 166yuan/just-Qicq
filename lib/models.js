/**
 * Created by Administrator on 2015/4/23.
 */
(function (exports) {
    var Sequelize =exports.Sequelize.require('sequelize');
    var sequelize = exports.sequelize=function (){
     return new Sequelize('mysql://root:root@localhost:3306/qicq');
    }

    var User = exports.User=function(){
      return  this.sequelize.define('User', {
            // auto increment, primaryKey, unique
            id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

            account : {type : Sequelize.STRING, allowNull : false},

            password : {type : Sequelize.STRING, allowNull : false}

        });
    }

    var getDb=exports.getDb=function (){
        this.User.find({account:"123"}).then(function(project) {
            // project will be an instance of Project and stores the content of the table entry
            // with id 123. if such an entry is not defined you will get null
            console.log(project);
        })
    }
})( (function(){
    if(typeof exports === 'undefined') {
        window.models = {};
        return window.models;
    } else {
        return exports;
    }
})() );