var express      = require('express')
var cookieParser = require('cookie-parser')
 
var app = express()
app.use(cookieParser())
 
app.get('/', function(req, res) {
  res.cookie('name','fsdfdsfsd').send('yes');

})
 app.get('/us', function(req, res) {
  res.send(req.cookies.name);
  console.log(cookies.get);


})
app.listen(8080)

 /*
var cookieSession = require('cookie-session')
var express = require('express')

var app = express()



app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.get('/', function (req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1
  console.log(req.session);

  // Write response
  res.end(req.session.views + ' views')
})

app.listen(3000)*/