var states = require('./models/usa_states')
var chance = require('chance').Chance()
var memberTypes = require('./member-types')
// var cors = require('cors')
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var md5 = require('blueimp-md5')
var moment = require('moment')
// var nano = require('nano')('http://root:shell@localhost:5984')
var unirest = require('unirest')
var couchbase = 'http://root:shell@localhost:5984/'
// var knex = require('knex')({
//   client: 'mysql2',
//   connection: {
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'shell',
//     database: 'olweg2'
//   }
// })

var app = express()

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
// app.use(cors())

// var API_KEY = 'myolweg';
// app.use(function (req, res, next) {
  // if (!req.xhr) {
  //   res.json({status: 401, msg: 'no direct linking'})
  // }
  // if(req.get('OLWEG-API') && req.get('OLWEG-API') === API_KEY) {
  //   next()
  // }
  //
  // res.json({status: 401, msg: 'no direct linkings'})
// })
// function guestsToArray(arr) {
//   return arr.split(',')
// }
var Events = couchbase+'events/';
var Genres = couchbase+'genres/';
var Members = couchbase+'members/';

// for (var i = 1; i < 100; i++) {
//     unirest.put(members)
// }
// var MemberModel = {
//   ref_id: chance.integer({min: 1, max: numMembers - 1}),
//   email: 'member' + i + '@olweg.com',
//   password: 'password',
//   type: chance.integer({min: 1, max: 3}),
//   img: 'http://placehold.it/50x50',
//   name: chance.first(),
//   address: chance.address(),
//   city: chance.city(),
//   state: chance.state(),
//   zip: chance.zip(),
//   verified: 0,
//   created_at: moment().format('YYYY-MM-DD HH:mm:00'),
//   updated_at: moment().format('YYYY-MM-DD HH:mm:00')
// }
//
// var eventModel = {
//   mid: mid,
//   date: createSqlDate(),
//   time: createSqlTime(),
//   title: chance.first(),
//   description: chance.paragraph(),
//   address: chance.address(),
//   city: chance.city(),
//   state: m.state,
//   zip: chance.zip(),
//   created_at: moment().format('YYYY-MM-DD HH:mm:00'),
//   updated_at: moment().format('YYYY-MM-DD HH:mm:00')
// }
var genres = ['ROCK','RAP','HIPHOP','BLUES','COUNTRY','R&B','CHILDRENS']
//   {genre: 'ROCK', verified: 1, created_at: moment().format('YYYY-MM-DD HH:mm:00')},
//   {genre: 'RAP', verified: 1, created_at: moment().format('YYYY-MM-DD HH:mm:00')},
//   {genre: 'HIPHOP', verified: 1, created_at: moment().format('YYYY-MM-DD HH:mm:00')},
//   {genre: 'BLUES', verified: 1, created_at: moment().format('YYYY-MM-DD HH:mm:00')},
//   {genre: 'COUNTRY', verified: 1, created_at: moment().format('YYYY-MM-DD HH:mm:00')},
//   {genre: 'R&B', verified: 1, created_at: moment().format('YYYY-MM-DD HH:mm:00')},
//   {genre: 'CHILDRENS', verified: 1, created_at: moment().format('YYYY-MM-DD HH:mm:00')}
// ]

genres.forEach(function (g) {
  unirest.put(Genres+g)
  .headers({'Accept':'application/json', 'Content-Type':'application/json'})
  .send({
    "name":g,
    "verified": false,
    "created_at": moment().format('YYYY-MM-DD HH:mm:00')
  }).end(function (res) {
    console.log(res)
  })
})

// for(var i=1;i<10;i++){
//   unirest.put(Members+i+'a')
//   .headers({'Accept':'application/json', 'Content-Type':'application/json'})
//   .send({
//     "name":"member "+i,
//     "type":"artist"
//   }).end(function (res) {
//     console.log(res)
//   })
// }

app.get('/seed', function (req, res) {
  unirest
  .post(Members+'_all_docs?include_docs=true')
  .headers({'Accept':'application/json', 'Content-Type':'application/json'})
  .send({include_docs:true})
  .end(function(resp){
    var ret = [];
    resp.body.rows.map(function (v) {
      ret.push(v.doc)
    })
    res.json(ret)
  })
})


app.get('/states.json', function (req, res) {
  res.json(states)
})



var port = process.env.PORT || 3000

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port)
})
