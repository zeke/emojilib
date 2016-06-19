const fs = require('fs')
const path = require('path')
const log = console.error
const thesaurus = require('thesaurus')
const swearjar = require('swearjar')
const emojis = require('./emojis.json')
const commonWords = require('subtlex-word-frequencies')
  .filter(w => w.count > 500)
  .map(w => w.word.toLowerCase())

Object.keys(emojis).forEach(key => {
  var emoji = emojis[key]
  log('\n\n', emoji.char)
  emoji.keywords.forEach(keyword => {
    log('\n', keyword)
    thesaurus.find(keyword)
      .filter(word => {
        return emoji.keywords.indexOf(word) === -1 // no dupes
        && commonWords.indexOf(word) > -1 // must be a common word
        && !swearjar.profane(word) // no profanity
      })
      .slice(0,5)
      .forEach(word => {
        log(`   ${word}`)
        emoji.keywords.push(word)
      })
  })
})

var json = JSON.stringify(emojis, null, 2)
process.stdout.write(json)
fs.writeFileSync(path.join(__dirname, 'emojis.json'), json)
