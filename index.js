var states = require('./models/usa_states')
var chance = require('chance').Chance()
var memberTypes = require('./member-types')
var cors = require('cors')
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
// var md5 = require('blueimp-md5')
var moment = require('moment')
var knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'shell',
    database: 'olweg2'
  }
})
var jwt = require('jsonwebtoken')
var jwtSecret = 'shell'
var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({origin: 'http://localhost:8081'}))

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
function checkAuth(req, res, next) {
  var token = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }
  jwt.verify(token, jwtSecret, function (err, decoded) {
    if (err) {
      console.log(err)
      return res.status(401).send(err)
    }
    // VERIFY this works. checks user agent against the one saved at login in charsets
    // someone hijacks the jwt
    if (decoded.agent !== req.get('User-Agent')) {
      console.log('user agent doesnt match token')
      return res.status(401).send('bad user-agent')
    }

    req.user = {id: decoded.id, type: decoded.type, email: decoded.email, agent: decoded.agent, refId: decoded.refId}
    next()
  })

}
app.get('/', function (req, res) {
  res.json({
    cookies: req.cookies,
    fresh: req.fresh,
    hostname: req.hostname,
    ip: req.ip,
    ips: req.ips,
    protocol: req.protocol,
    secure: req.secure,
    stale: req.stale,
    xhr: req.xhr,
    accepts: req.accepts(),
    charsets: req.acceptsCharsets(),
    encodings: req.acceptsEncodings()
  })
})
var types = {
  1: 'ARTIST',
  2: 'VENUE',
  3: 'GUEST'
}

var members = {
  1: {
      id: 1,
      refId: 1,
      type: 1,
      email: 'artist@olweg.com'
  },
  2: {
      id: 2,
      refId: 2,
      type: 2,
      email: 'venue@olweg.com'
  }
}
var generalData = {
  name: 'artist',
  city: 'GRAND RAPIDS',
  state: 'MI',
  zip: '49503'
}
var profiles = {
  1: {
    url: '/artist',
    profileImage: 'http://placehold.it/350x150/ffffff/000000.png?text=artist',
  },
  2: {
    url: 'venue',
    profileImage: 'http://placehold.it/350x150/ffffff/000000.png?text=venue',
    address: '123 nowhere ne',
  }
}
var audio = {
    1: ['audio 1', 'audio 2', 'audio 3']
}

var events = {
  1: ['artist event', 'artist event', 'artist event'],
  2: ['venue event', 'venue event', 'venue event'],
  3: ['guest event', 'guest event', 'guest event'],
}
app.get('/profile', checkAuth, function (req, res) {
  var profile = profiles[req.user.type]
  if(audio.hasOwnProperty(req.user.type)) {
    profile.audio = audio[req.user.type]
  }
  profile.events = events[req.user.type]

  res.json(profile)
})
app.get('/general', checkAuth, function (req, res) {
  var general = generalData
  general.events = events[req.user.type]

  res.json(general)
})

app.post('/general', checkAuth, function (req, res) {
  console.log(req.body)
  res.json(req.body)
})

app.get('/auth', checkAuth, function (req, res) {
  console.log('/auth')
  console.log(req.user, req.get("User-Agent"))
  res.json({data: req.user})
})

app.post('/login', function (req, res) {
  console.log('/login')
  res.set('Cache-control', 'no-store')
  res.set('ETag', false)

  var creds = req.body.credentials.email || null
  var pass = req.body.credentials.password || null
  var agent = req.body.credentials.agent || null

  if (creds && pass) {
    if (creds === 'ericshell2010@gmail.com' && pass === 'test') {
      // store id, type, email, and user-agent (for security)
      var token = jwt.sign({
                              id: members[1].id,
                              refId: members[1].refId,
                              type: members[1].type,
                              email: members[1].email,
                              agent
                          },
        jwtSecret,
        {expiresIn: 60*60})

      return res.json({
        token,
        agent,
        data: {
          id: members[1].id,
          refId: members[1].refId,
          type: members[1].type,
          email: members[1].email
        }
      })
    } else {
      return res.json({status: 403, msg: 'Unauthorized'})
    }
  } else {
    return res.json({status: 403, msg: 'unauthorized'})
  }
})

// function guestsToArray(arr) {
//   return arr.split(',')
// }
// app.get('/events.json', function (req, res) {
//   console.time('events.json?', req.query)
//   var q = knex('events');
//   // need partial query for listings and full query for direct query (event_id = ?)
//   if (req.query['members.eid']) {
//     // q.select('events.eid', 'events.title', 'events.description', 'events.date','events.time', 'events.address', 'events.city', 'events.state', 'events.zip')
//     q.select('events.eid', 'events.title', 'events.description', 'events.date','events.time', 'events.address', 'events.city', 'events.state', 'events.zip',knex.raw('GROUP_CONCAT(members.email) as guests'))
//
//   } else {
//     // q.select('events.eid', 'events.title', 'events.date','events.time','events.city', 'events.state', 'events.zip')
//     q.select('events.eid', 'events.title', 'events.date','events.time','events.city', 'events.state', 'events.zip',knex.raw('GROUP_CONCAT(members.email) as guests'))
//
//   }
//   q.innerJoin('members_events', 'events.eid', 'members_events.eid')
//   q.innerJoin('members', 'members_events.mid', 'members.mid')
//   q.where(function () {
//     // only show dates from today or later
//     this.where('events.date', '>', moment().format('YYYY-MM-DD'))
//   }).orderBy('events.date').orderBy('events.time')
//   q.groupBy('events.eid')
//   .where(req.query).then(function (r) {
//     r.forEach(function (ev) {
//       ev.guests = guestsToArray(ev.guests)
//     })
//
//     res.json(r)
//   }).catch(function (err) {
//     console.log(err)
//     res.json(err)
//   })
//   console.timeEnd('events.json?', req.query)
//
// })


// app.get('/states.json', function (req, res) {
//   res.json(states)
// })

// app.get('/members.json', function (req, res) {
//   console.time('members.json?',req.query)
//
//   if (req.query.password || req.query.email) { //dont allow searching for users by password or email
//     console.log('bad query!!',req.query)
//     return res.send('')
//   }
//
//   var q = knex('members').select('members.mid', 'members.name', 'members.city', 'members.state',
//   knex.raw('GROUP_CONCAT(distinct genres.gid, ":", genres.genre) genres'))
//     .leftJoin('members_genres', 'members.mid', 'members_genres.mid')
//     .leftJoin('genres', 'members_genres.gid', 'genres.gid')
//     // .leftJoin('members_events', 'members.mid', 'members_events.mid')
//     // .leftJoin('events', 'events.eid', 'members_events.eid')
//
//   if (req.query.genres) {
//     q.whereIn('members_genres.gid', JSON.parse(req.query.genres)) //filter by genre(s)
//     delete req.query.genres
//   }
//
//   q.groupBy('members.mid')
//   q.where(req.query).then(function (r) {
//     r.forEach(function (m) {
//       m.genres = genresToArray(m.genres)
//     })
//     console.log(q.toSQL())
//     res.json(r)
//
//   }).catch(function (err) {
//     console.log(err)
//     res.send('')
//
//   })
//
//   console.timeEnd('members.json?',req.query)
// })

// app.get('/genres.json', function (req, res) {
//   // var ret = []
//   knex('genres').select('gid', 'genre', 'verified').then(function(r) {
//     r.map(function (g) {
//       if (g.verified === 1) {
//         return g
//       }
//     })
//     res.json(r)
//   })
// })
//
// app.get('/locations.json', function (req, res) {
//   // get number of members per state
//   var q = knex('members').select('state', knex.raw('count(state) as numMembers')).orderBy('state').groupBy('state')
//
//   q.then(function (r) {
//     res.json(r)
//   })
// })

var port = process.env.PORT || 3000

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port)
})

//
// function genresToArray (arr, delim=',') {
//   var list = arr.split(delim)
//   var ret = []
//   list.forEach(function (item) {
//     var bits = item.split(':')
//     ret.push({id: bits[0], genre: bits[1]})
//
//   })
//
//   return ret
//
// }
