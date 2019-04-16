const git = require('simple-git')
const migrate = require('migrate')

migrate.load({
  stateStore: `.migrate_${process.env.NODE_ENV}`
}, function (err, set) {
  if (err) {
    throw err
  }
  set.up(function (err) {
    if (err) {
      throw err
    }
    console.log('migrations successfully ran')
  })
})

git().add('./*').commit('add migration state').push('origin', 'master')
