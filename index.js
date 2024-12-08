const nunjucks = require('nunjucks')
const fs = require('fs')

const contentPath = 'content'
const outputPath = 'dist'
const templatesPath = 'templates'

async function main() {
    nunjucks.configure({ autoescape: true })
    const pages = ['index', 'projects']
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)
    // Iterate on all pages, render them and export as HTML in outputPath
    for (const page of pages) {
        const navigation = nunjucks.render(`${templatesPath}/navigation.html`, { page })
        let pageContent = null
        // Render page content
        let contentData = {}
        if (page === 'index') {
            const posts = JSON.parse(fs.readFileSync(`${contentPath}/posts.json`, 'utf8'))
            contentData.posts = []
            for (const postData of posts) {
                const postContentPath = `${contentPath}/posts_content/${postData.contentid}`
                const postContent = nunjucks.render(`${postContentPath}/index.html`, { contentPath: `../${postContentPath}` })
                contentData.posts.push({
                    ...postData,
                    content: postContent,
                })
            }
        } else if (page === 'projects') {
            contentData.projects = JSON.parse(fs.readFileSync(`${contentPath}/projects.json`, 'utf8'))
        }
        pageContent = nunjucks.render(`${templatesPath}/pages/${page}.html`, contentData)
        const pageData = {
            navigation,
            pageContent
        }
        const pageHtml = nunjucks.render(`${templatesPath}/main.html`, pageData)
        fs.writeFileSync(`${outputPath}/${page}.html`, pageHtml)
    }
}
main()