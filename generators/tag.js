const nunjucks = require('nunjucks')
const fs = require('fs')

const {
  contentPath
} = require('../config')

module.exports = function generate(tagName) {
  const posts = JSON.parse(fs.readFileSync(`${contentPath}/posts.json`, 'utf8'))
  const tagPosts = posts.filter((p) => p.tags.includes(tagName))
  const contentData = {
    posts: []
  }
  for (const postData of tagPosts) {
      const postContentPath = `${contentPath}/posts_content/${postData.contentid}`
      const postContent = nunjucks.render(`${postContentPath}/index.html`, { contentPath: `../${postContentPath}` })
      contentData.posts.push({
          ...postData,
          content: postContent
      })
  }
  return contentData
}