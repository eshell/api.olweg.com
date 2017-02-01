// function randomID (salt) {
//   return md5((salt || new Date()) + Math.random())
// }

// function randomInt(start, end) {
//   return Math.floor(Math.random() * (end - start + 1)) + start
// }

function genre (name) {
  return {
    id: chance.guid(),
    name: 'genre'
  }
}

// function mevent (title, time, where, genres) {
//   return {
//     id: randomID(),
//     title: title || 'title',
//     time: time || moment().format('M/D/YYYY h:mma'),
//     country: 'USA',
//     address: randomInt(1,9999) + ' somewhere',
//     city: 'Rockford',
//     state: states[randomInt(0, sl)].id,
//     zip: randomInt(11111, 99999),
//     genres: [genre(), genre(), genre()]
//   }
// }

// console.log('mts:',mts)
function member () {
  var id = chance.guid()
  var type = chance.integer({min:0,max: memberTypes.length-1})
  var name = chance.first()
  var country = 'USA'
  var address = chance.address()
  var city = chance.city()
  var state = chance.state()
  var zip = chance.zip()
  var genres = [genre(), genre(), genre()]

  return {
    id: id,
    type: memberTypes[type].name,
    name:  name,
    country: country,
    address: address,
    city: city,
    state: state,
    zip: zip,
    genres: genres
  }
}

// function location (country, address, city, state, zip) {
//   return {
//     id: 1,
//     country: country || 'USA',
//     address: address || '1234 somewhere',
//     city: city || 'Rockford',
//     state: state || 'MI',
//     zip: zip || '49341'
//   }
// }

module.exports = {
  member
}
