const nunjucks = require('nunjucks')
const fs = require('fs')

const {
    templatesPath,
    outputPath
} = require('./config')

const pages = ['index', 'projects']

async function main() {
    try {
        nunjucks.configure({ autoescape: true })
        if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)
        // Iterate on all pages, render them and export as HTML in outputPath
        for (const page of pages) {
            const navigation = nunjucks.render(`${templatesPath}/navigation.html`, { page })
            let pageContent = null
            // Render page content
            const pageGenerator = require(`./generators/${page}`)
            const contentData = pageGenerator()
            pageContent = nunjucks.render(`${templatesPath}/pages/${page}.html`, contentData)
            const pageData = {
                navigation,
                pageContent
            }
            const pageHtml = nunjucks.render(`${templatesPath}/main.html`, pageData)
            fs.writeFileSync(`${outputPath}/${page}.html`, pageHtml)
        }
    } catch (e) {
        console.error(e)
    }
}
main()