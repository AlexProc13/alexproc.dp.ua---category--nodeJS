var express = require('express');
var models = require('./models/models.js');
var api = express.Router();

//Главная страница API
api.get('/', function(req, res) {
  res.send('Добро пожалывать. Тут вы можете удалять итд');
});
//Таблицы
api.route('/program')
  .get(function(req, res) {
    models.tasks.get(function(err,result){
		if (result.length !== 0){
			res.json(result);
		}
		else{
			res.json({massage : 'тут пусто'})
		}
	})
  })//INSERT INTO `allPrograms` (`id`, `title`, `date`, `description`) VALUES (NULL, 'аыв', 'авыаы', 'аываыв');
	.post(function(req, res) {
		//console.log(req.body);
		models.tasks.add(req.body,function(err,result){
			if (err){
				console.log(err);
				return;
			}
			else{
				res.json({massage : 'Программа добавлена'})
			}
		})
	})

api.route('/program/:id')
	.delete(function(req, res) {
		var id ={id: req.params.id};
		models.tasks.delete(id,function(err,result){
			if (err){
				console.log(err);
				return;
			}
			else{
				res.json({massage : 'Программа удалена'})
			}
		})
	})
	.put(function(req, res) {
		var date = {
			title: req.body.title,
			date: req.body.date,
			description: req.body.description
		};
		models.tasks.edit(req.params.id,date,function(err,result){
			if (err){
				console.log(err);
				return;
			}
			else{
				res.json({massage : 'Программа изменена'})
			}
		})
	})

//Пользователи
api.route('/user')
	.get(function(req, res) {
		models.users.get(function(err,result){
			if (result.length !== 0){
				res.json(result);
			}
			else{
				res.json({massage : 'тут пусто'})
			}
		})
	})
	.post(function(req, res) {
		//console.log(req.body);
		models.users.add(req.body,function(err,result){
			if (err){
				console.log(err);
				return;
			}
			else{
				res.json({massage : 'Пользователь добавлен'})
			}
		})
	})

api.route('/user/:id')
	.get(function(req, res) {
		var id ={id: req.params.id};
		models.users.getID(id,function(err,result){
			if (err){
				console.log(err);
				return;
			}
			else{
				res.json(result)
			}
		})
	})

/*
GET    /program — list
GET    /program/{id} — информация о телефоне
POST   /program — добавляет новый номер
PUT    /program/{id} — изменение информации о телефоне
DELETE /program/{id} — удаление


GET    /users - list
GET    /users/{id} - информация о пользователе
POST   /users — регистрация
PUT    /users/{id} — Обновление данных пользователя
DELETE /users/{id} — удаление пользователя
/api/v1/..
/api/v2/..
*/



//Отдаем в основной файл
module.exports = api;