/*Подключаем модули
Подключаем express*/
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
//Подключение модулей - функий
var mysql = require('mysql');
var models = require('./models/models.js');
//boody parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//session
var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
//Делаем папку для статических файлов
app.use(express.static('public'));
//Для handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views',
    partialsDir:[
        __dirname + '/views/'
    ],
    helpers: {
        inc: function(value, options)
        {
            return parseInt(value) + 1;
        }
    }
}));
app.set('view engine', 'handlebars');
var port = process.env.PORT || 3000;
var api = require('./api');
app.use('/api/v1', api);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Реализация основных запросов

app.get('/',function (req,res) {
    res.redirect('/getPrograms');
});

app.get('/getPrograms', function (req, res) {
    models.tasks.get(function (err,result) {
        if (result.length !== 0){
            //console.log(result);
            var user_name;
            if (req.session.name){
                user_name = req.session.name;
            }
            else{
                //console.log(req.cookies);
               if (req.cookies.user_name){
                    user_name = req.cookies.user_name;
                }
                else{
                    user_name = null;
                }
            }
            res.render('table',{
                allProgr: result,
                username: user_name ? user_name : null
            });
        }
        else{
            res.render('index',{
            });
        }
    });
});


//Изменить_____________________________________
app.get('/edit/:id', function (req, res) {
    var date;
    var idProg = {id: req.params.id};
    models.tasks.getID(idProg,function (err,result) {
        date = {
            id: result[0].id,
            title: result[0].title,
            date: result[0].date,
            description: result[0].description
        };
        res.render('edit',date);
    });
});

app.post('/save', function (req, res) {
    var date = {
        title: req.body.title,
        date: req.body.date,
        description: req.body.description
    };
    models.tasks.edit(req.body.id,date,function(err,result) {
     if (err){
     console.log(err);
     return;
     }
     else{
         res.redirect('/getPrograms');
     }
     });
});

// Добавить 
app.get('/add', function (req, res) {
    res.render('index',{
    });
});

app.get('/auth', function (req, res) {
    var user_name;
    if (req.session.name){
        user_name = req.session.name;
    }
    else{
        //console.log(req.cookies);
        if (req.cookies.user_name){
            user_name = req.cookies.user_name;
        }
        else{
            user_name = null;
        }
    }
    res.render('auth',{
        user_name: user_name ? user_name : null
    });
});

//Добавить программу
app.post('/addProg', function (req, res) {
    models.tasks.add(req.body,function (err,result) {
        if (err){
            console.log(err);
            return;
        }
        //console.log(req.body);
        res.redirect('/');
    });
});
app.get('/delete/:id', function (req, res) {
    var id ={id: req.params.id};
    models.tasks.delete(id,function (err,result) {
        if (err) {
            console.log(err);
            return;
        }
    });
    res.redirect('/getPrograms');
});

//e***************************************

//аутендификация
app.post('/auth', function (req, res) {
    //запрос проверка логина!!!!!!!!!!!!
    //console.log(req.body.user_name);
    var param = {user_name: req.body.user_name};
    models.users.getID(param,function (err,result) {
        var getsName = result;
        if (getsName[0]){
            //console.log(getsName[0].user_pass);
            if (getsName[0].user_pass==req.body.user_pass){
                //установка сесиии и кук
                req.session.name = getsName[0].user_name;
                //console.log(req.session.name);
                //Установить сессию
                if (req.body.remember){
                    //устаговить куки
                    res.cookie('user_name',getsName[0].user_name, { expires: new Date(Date.now() + 900000), httpOnly: true });
                }
                res.send('Все хорош.Старая запись');
                //res.redirect('/');
            }
            else{
               res.send('Ошибка. Не тот пароль');

                //res.render('nopass',{
                    //user_name: user_name ? user_name : null
               // });
            }
        }
        else {
            //console.log(getsName[0]);
            var date ={user_name: req.body.user_name,
                user_pass: req.body.user_pass};
            models.users.add(date,function (err,result) {
                if (err){
                    res.send('Ошибка');
                    console.log(err);
                    return;
                }
                else{
                    req.session.name = req.body.user_name;
                    //console.log(req.session.name);
                    //Установить сессию
                    res.send('Новый пользователь');
                    if (req.body.remember){
                        //устаговить куки
                        res.cookie('user_name', req.body.user_name, { expires: new Date(Date.now() + 900000), httpOnly: true });
                    }
                   // res.redirect('/');
                }
            });
        }
    });
});

// Запрос вызод
app.get('/logout',function (req,res) {
    res.clearCookie('user_name');
    req.session = null;
    res.redirect('/');
});
//обработка запросов - не обработанных 404 
app.use(function(req, res, next){
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.render('404', {
            url: req.url
        });
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
});

//Запускаем 3000 порт
app.listen(port, function () {
    console.log('listening on port '+ port);
});

