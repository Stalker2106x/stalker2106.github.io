const fs = require('fs')

const {
  contentPath
} = require('../config')

module.exports = function generate() {
  return {
    projects: JSON.parse(fs.readFileSync(`${contentPath}/projects.json`, 'utf8'))
  }
}
