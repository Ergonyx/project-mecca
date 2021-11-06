const axios = require('axios') // For the request to scrape
const cheerio = require('cheerio') // For the DOM manipulation
const {text} = require('cheerio/lib/api/manipulation')
const {compareDocumentPosition} = require('domutils')
const express = require('express') // For the routing/api stuff

const app = express()
const port = 3005

const url = 'https://www.memoryexpress.com/Clearance/Store/CalNE'

//
// This scraping function will be configured to run approximately every 4 hours
// as I don't want to overstress their webhost.  This is also why I did not
// include images in this aggregator.
//

let scrapedJSON = []

axios(url) // Open connection and get some data baby! OM NOM NOM!
    .then(res => { // Let's see what our response is...
        if (res.status === 200) { // 200 = OK!
            const html = res.data // Get my raw HTML
            const $ = cheerio.load(html) // Process HTML in Cheerio
            // NOTE: Start collecting data

            $('.c-clli-group', html).each(function () {
                const category = $(this).find('.c-clli-group__header-title').text().trim()
                $(this).find('.c-clli-group__items > .c-clli-item').each(function () {
                    const title = $(this).find('.c-clli-item-info__title').text().trim()
                    const url = 'https://memoryexpress.com' + $(this).find('a').attr('href')
                    scrapedJSON.push({
                        category,
                        title,
                        url
                    })
                })
            })
            console.log(scrapedJSON)
        }
    })

// Configure ExpressJS to listen for incoming connections.
app.listen(port, () => {
    console.log(`Server now listening on port: ${port}`)
})