const nunjucks = require('nunjucks')
const fs = require('fs')

const {
  contentPath
} = require('../config')

module.exports = function generate() {
  const posts = JSON.parse(fs.readFileSync(`${contentPath}/posts.json`, 'utf8'))
  const contentData = {
    tags: getTagList(posts),
    posts: []
  }
  for (const postData of posts) {
      const postContentPath = `${contentPath}/posts_content/${postData.contentid}`
      const postContent = nunjucks.render(`${postContentPath}/index.html`, { contentPath: `../${postContentPath}` })
      contentData.posts.push({
          ...postData,
          content: postContent
      })
  }
  return contentData
}