var chance = require('chance').Chance()
var moment = require('moment')

var members = []
var numMembers = 1000
var membersGenres = []

var genres = [
  {genre: 'ROCK', verified: 1, created_at: createSqlDateTime(false, true)},
  {genre: 'RAP', verified: 1, created_at: createSqlDateTime(false, true)},
  {genre: 'HIPHOP', verified: 1, created_at: createSqlDateTime(false, true)},
  {genre: 'BLUES', verified: 1, created_at: createSqlDateTime(false, true)},
  {genre: 'COUNTRY', verified: 1, created_at: createSqlDateTime(false, true)},
  {genre: 'R&B', verified: 1, created_at: createSqlDateTime(false, true)},
  {genre: 'CHILDRENS', verified: 1, created_at: createSqlDateTime(false, true)}
]

for (var i = 1; i < numMembers; i++) {
  members.push({
    ref_id: chance.integer({min: 1, max: numMembers - 1}),
    email: 'member' + i + '@olweg.com',
    password: 'password',
    type: chance.integer({min: 1, max: 3}),
    img: 'http://placehold.it/50x50',
    name: chance.first(),
    address: chance.address(),
    city: chance.city(),
    state: chance.state(),
    zip: chance.zip(),
    verified: 0,
    created_at: createSqlDateTime(false, true),
    updated_at: createSqlDateTime(false, true)
  })
}

var maxEvents = 20
var uEvents = []
var uGenres = []
var maxEventMembers = 5
var umembers_events = []
var members_events = []

members.forEach(function (m, idx) {
  var numGenres = chance.integer({min: 1, max: genres.length})
  var numEvents = chance.integer({min: 1, max: maxEvents})
  var mid = idx+1

  for (var i = 1; i <= numEvents; i++) {

    uEvents.push({
      mid: mid,
      date: createSqlDate(),
      time: createSqlTime(),
      title: chance.first(),
      description: chance.paragraph(),
      address: chance.address(),
      city: chance.city(),
      state: m.state,
      zip: chance.zip(),
      created_at: createSqlDateTime(false, true),
      updated_at: createSqlDateTime(false, true)
    })
  }
  // build unique array of event members
  for (var i = 1; i <= maxEventMembers; i++) {
    var mnum = chance.integer({min: 1, max: members.length})

    if (umembers_events.indexOf(mnum) === -1) {
      umembers_events.push(mnum)
    }
  }

  umembers_events.forEach(function (e) {
    members_events.push({mid: mid, eid: e})
  })

  // build unique array of genres
  for (var i = 1; i <= numGenres; i++) {
    var gNum = chance.integer({min: 1, max: genres.length})

    if (uGenres.indexOf(gNum) === -1) {
      uGenres.push(gNum)
    }
  }

  uGenres.forEach(function (g) {
    membersGenres.push({mid: mid, gid: g})
  })

  uGenres = []
  umembers_events = []
})

exports.seed = function (knex, Promise) {
  return Promise.all([
    knex('members').insert(members),
    knex('genres').insert(genres),
    knex('members_genres').insert(membersGenres),
    knex('events').insert(uEvents),
    knex('members_events').insert(members_events)
  ])
}


function padDate (num) {
  if (num < 10) {
    return '0'+num
  }
  return num
}

function createSqlDateTime (random=true, now=false, m, d, y, h, i) {
  var date = createSqlDate(random, now, m, d, y)
  var time = createSqlTime(random, now, h, i)

  return date + ' ' + time
}

function createSqlDate (random=true, now=false, m, d, y) {
  var sqlDateFormat = 'YYYY-MM-DD'
  if (now) {
    return moment().format(sqlDateFormat)
  }

  if (random) {
    y = chance.integer({min: 2016, max: 2017})
    m = chance.integer({min: 1, max: 12})
    d = chance.integer({min: 1, max: 25})
  }

  return moment(y + '-' + padDate(m) + '-' + padDate(d)).format(sqlDateFormat)
}

function createSqlTime (random=true, now=false, h, m) {
  var sqlTimeFormat = 'HH:mm:00'
  if (now) {
    return moment().format(sqlTimeFormat)
  }

  if (random) {
    h = chance.pickone(['08','09','10','11','12','13','14','19','20','21'])
    m = chance.pickone(['00','30'])
  }

  return moment('2016-01-01 '+h+':'+padDate(m)+':00').format(sqlTimeFormat)
}
