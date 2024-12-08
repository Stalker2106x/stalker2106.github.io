const nunjucks = require('nunjucks')
const path = require('path')
const fs = require('fs')
const { getTagList } = require('./utils')

const {
    PostsPerPage,
    PostsContentPath,
    TemplatesPath,
    ContentPath,
    OutputPath
} = require('./config')


function injectPostsContent(posts) {
    const filledPosts = []
    for (const postData of posts) {
        const postContentPath = `${PostsContentPath}/${postData.contentid}`
        const postContent = nunjucks.render(`${postContentPath}/index.html`, { contentPath: `../${postContentPath}` })
        filledPosts.push({
            ...postData,
            content: postContent
        })
    }
    return filledPosts
}

function generatePage(pageName, outputName, pageData) {
    const navigation = nunjucks.render(`${TemplatesPath}/navigation.html`, { pageName })
    let pageContent = null
    pageContent = nunjucks.render(`${TemplatesPath}/pages/${pageName}.html`, pageData)
    const fullpageData = {
        navigation,
        pageContent
    }
    const fullpageHtml = nunjucks.render(`${TemplatesPath}/main.html`, fullpageData)
    fs.writeFileSync(`${OutputPath}/${outputName}.html`, fullpageHtml)
}

function cleanDist() {
    const dir = fs.opendirSync(OutputPath)
    let dirent
    while ((dirent = dir.readSync()) !== null) {
        if (dirent.isFile() && dirent.name.endsWith('.html')) {
            fs.unlinkSync(path.join(OutputPath, dirent.name))
        }
    }
    dir.closeSync()
}

async function main() {
    const posts = JSON.parse(fs.readFileSync(`${ContentPath}/posts.json`, 'utf8'))
    const projects = JSON.parse(fs.readFileSync(`${ContentPath}/projects.json`, 'utf8'))
    const tags = getTagList(posts)
    try {
        nunjucks.configure({ autoescape: true })
        cleanDist()
        // Generate posts pages
        const pageCount = Math.floor(posts.length / PostsPerPage) + (posts % PostsPerPage == 0 ? 0 : 1)
        for (let pageNumber = 0; pageNumber < pageCount; pageNumber++) {
            const pagePosts = posts.slice(pageNumber * PostsPerPage, (pageNumber + 1) * PostsPerPage)
            generatePage('index', pageNumber == 0 ? 'index' : `index-${pageNumber}`, { pageNumber, pageCount, posts: injectPostsContent(pagePosts), tags })
        }
        // Generate projects page
        generatePage('projects', 'projects', { projects })
        // Generate tags pages
        for (const tag of tags) {
            const pagePosts = posts.filter((p) => p.tags.includes(tag.name))
            generatePage('tag', `tag-${tag.name}`, { posts: injectPostsContent(pagePosts), tagName: tag.name })
        }
    } catch (e) {
        console.error(e)
    }
}
main()