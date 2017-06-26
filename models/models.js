var mysql = require('mysql');
var pool;
var config =require('./config')
var connection = function(host,user,pass,db){
		pool =  mysql.createPool(config.DB);

pool.getConnection(function(err, connection){
	if (err){
			console.error(err); 
			}
	else{
		  	console.log('connect DB - yes'); 
	}
});
}


//ОСНОВЫНЕ ЗАПРОСЫ УДАЛЕНИЕ СОЗДАНИЕ И ИЗМЕНЕНИЕ
tasks={
	//Получить
	get : function(callback){
		pool.query('SELECT * FROM allPrograms',callback);
	},
	add : function(date,callback){
		pool.query('INSERT INTO allPrograms SET ?',date,callback);
	},
	edit : function(id,date,callback){
		var sql='UPDATE allPrograms SET title = ?, date = ?, description = ? WHERE allPrograms. id = ?';
		pool.query(sql,[date.title,date.date,date.description,parseInt(id)],callback);
	},//UPDATE allPrograms SET title = ?, date = ?, description = ? WHERE allPrograms id = ?;
	delete : function(id,callback){
		pool.query('DELETE FROM allPrograms WHERE allPrograms. ?',id,callback);		
	},
	getID: function(date,callback){
		pool.query('SELECT * FROM allPrograms WHERE ?',date,callback);
	}
}

users = {
		//Получить
	add : function(date,callback){
		pool.query('INSERT INTO user_name SET ?',date,callback);
	},
	getID: function(date,callback){
		pool.query('SELECT * FROM user_name WHERE ?',date,callback);
	},
	get: function(callback){
		pool.query('SELECT * FROM user_name', callback);
	}
}

//SELECT * FROM `user_name` WHERE `user_name` = 1


//Экспорт в основной файл
module.exports.conDB = connection();
module.exports.tasks = tasks;
module.exports.users = users;

