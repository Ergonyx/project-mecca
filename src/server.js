const axios = require('axios') // For the request to scrape
const cheerio = require('cheerio') // For the DOM manipulation
const {text} = require('cheerio/lib/api/manipulation')
const {compareDocumentPosition} = require('domutils')
const express = require('express') // For the routing/api stuff

const app = express()
const port = 3005

const url = 'https://www.memoryexpress.com/Clearance/Store/CalSE'

//
// This scraping function will be configured to run approximately every 4 hours
// as I don't want to overstress their webhost.  This is also why I did not
// include images in this aggregator.
//

let scrapedJSON = [] // Temporary data storage.

const getDiscount = (reg, sale) => {
    const regex = /[$,]/gm
    return Math.floor(100 - ((sale.replace(regex,'') / reg.replace(regex,'')) * 100))
}

const scrapeIt = () => {
    const startTime = new Date().getTime()
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
                        const sku = $(this).find('.c-clli-item-info__codes > span:first-child').text().trim()
                        const regularPrice = $(this).find('.c-clli-item-price__regular').text().trim()
                        const clearancePrice = $(this).find('.c-clli-item-price__clearance-value').text().trim()
                        const salePrice = $(this).find('.c-clli-item-price__sale-value').text().trim()
                        const discount = getDiscount(regularPrice, salePrice)
                        scrapedJSON.push({
                            category,
                            title,
                            url,
                            sku,
                            regularPrice,
                            clearancePrice,
                            salePrice,
                            discount
                        })
                    })
                })
                
                console.log(scrapedJSON)
            }
        }).then(() => {
            const endTime = new Date().getTime()
            console.log('Time to complete: ' + (endTime - startTime) / 1000 + 's')
        })
}

scrapeIt()



// Configure ExpressJS to listen for incoming connections.
app.listen(port, () => {
    console.log(`Server now listening on port: ${port}`)
})