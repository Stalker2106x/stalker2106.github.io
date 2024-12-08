function getTagList (posts) {
  const tags = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tags.hasOwnProperty(tag)) {
        tags[tag] = 1
      } else {
        tags[tag] += 1
      }
    }
  }
  return Object.keys(tags).map(tagName => ({
    name: tagName,
    count: tags[tagName]
  }))
}

module.exports = { getTagList }