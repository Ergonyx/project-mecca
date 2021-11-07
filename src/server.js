const axios = require('axios') // For the request to scrape
const cheerio = require('cheerio') // For the DOM manipulation
const {text} = require('cheerio/lib/api/manipulation')
const {compareDocumentPosition} = require('domutils')
const express = require('express') // For the routing/api stuff

const app = express()
const port = 3005

//
// This scraping function will be configured to run approximately every 4 hours
// as I don't want to overstress their webhost.  This is also why I did not
// include images in this aggregator.
//

let scrapedJSON = [] // Temporary data storage.
let lastUpdated = 1635746400000// This will be the UTC time the stores were last scraped.
let nextUpdate = 1635760800000
const stores = ['CalNE', 'CalNW', 'CalSE', 'BBBC', 'Edm1', 'EdmW', 'ONHM', 'LYBC', 'ONLON', 'ONOTT', 'SKST', 'VBBC', 'BCVIC1', 'WpgW']


// Just a small function for readability elsewhere.
const getDiscount = (reg, sale) => {
    const regex = /[$,]/gm
    return Math.floor(100 - ((sale.replace(regex,'') / reg.replace(regex,'')) * 100))
}

const fullSendScraper = (stores) => {
    console.log('Checking if update is needed.')
    if (new Date().getTime() >= lastUpdated) {
        console.log('Updated required.  Begin scraping.')
        // Here we'll clear the existing array and build it with new data.
        scrapedJSON.length = 0 // Reset the "database"
        lastUpdated = new Date().getTime() // UTC data was last updated.
        stores.forEach(lmnt => {
            scrapeIt(lmnt)
        });
        nextUpdate = lastUpdated + 14400000 // Set time for next update.
    } else {
        console.log('No update required.  Serving data.')
    }
}

const scrapeIt = (store) => {
    const startTime = new Date().getTime()
    axios(`https://www.memoryexpress.com/Clearance/Store/${store}`) // Open connection and get some data baby! OM NOM NOM!
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
                            store,
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
            }
        }).then(() => {
            const endTime = new Date().getTime()
            console.log(`(${store}) Time to complete: ${(endTime - startTime) / 1000}s (${scrapedJSON.length} items)`)
        }).catch(function (error) {
            console.log(`Error Code: ${error.response.status}`)
        })
}

// scrapeIt('CalNEW')
fullSendScraper(stores)

// Configure ExpressJS to listen for incoming connections.
app.listen(port, () => {
    console.log(`Server now listening on port: ${port}`)
})