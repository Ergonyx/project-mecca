const axios = require('axios'); // For the request to scrape
const cheerio = require('cheerio'); // For the DOM manipulation
const express = require('express'); // For the routing/api stuff
const app = express();
const creds = require('./my.credentials.json') // credentials for things.
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// CORS for testing on local development configuration.
const cors = require('cors');
const { response } = require('express');
app.use(cors())

// Some general settings.
const port = 80;
const messages = [];
const stats = {
    visits: 0,
    lastUpdated: 0
};

// Do Express Routing
app.get('/mecca', (req, res) => {
    const yyc = [];
    scrapedJSON.forEach(lmnt => {
        if (lmnt.store === 'CalNE' || lmnt.store === 'CalNW' || lmnt.store === 'CalSE') {
            yyc.push(lmnt);
        }
    });
    stats.visits++
    stats.lastUpdated = new Date(lastUpdated)
    res.send({yyc,stats});
});

// Edmonton Location
app.get('/mecca/yeg', (req, res) => {
    const yeg = [];
    scrapedJSON.forEach(lmnt => {
        if (lmnt.store === 'Edm1' || lmnt.store === 'EdmW') {
            yeg.push(lmnt);
        }
    });
    res.json(yeg);
});

// Contact Page
app.get('/contact', (req, res) => {
    let form = `
        <form action="/contact" method="POST">
            <label for="contactName">Your Name</label>
            <input type="text" name="contactName"><br>
            <label for="email">E-Mail</label>
            <input type="email" name="email"><br>
            <label for="message">Message</label>
            <input type="textarea" name="message"><br>
            <input type="submit">
        </form>
    `
    res.send(form)
})
// Add contact form responses to a file for later review.
app.post('/contact', (req, res) => {
    let newContact = req.body
    newContact.id = messages.length
    messages.push(newContact)
    console.log("New Message Added!")
    res.send("Thanks for reaching out!  Have a great day!")
})
// View messages
// Render the login form.
app.get('/messages', (req,res) => {
    let login = `
    <div style="display: flex;">
        <form action="/messages" method="POST" style="margin: 25% auto; transform: scale(2);">
            <label for="username">Username</label><br>
            <input type="text" name="username"><br>
            <label for="password">Password</label><br>
            <input type="password" name="password"><br>
            <input type="submit" value="LOGIN" style="margin: .5rem .25rem;">
        </form>
    </div>
    `
    res.send(login)
})
// Process login data and return messages if login is good or error if not.
app.post('/messages', (req, res) => {
    if (req.body.username === creds.user && req.body.password === creds.password) {
        let messageList = '<h2>Messages Below</h2>'
        messages.forEach(el => {
            messageList += `<a href="mailto:${el.email}">${el.contactName}</a>: ${el.message}<br>`
        })
        messageList += `<a href="./messages">Back</a>`
        res.send(messageList)
    } else {
        res.send(`
        <div style="display: flex;">
        
        <form action="/messages" method="POST" style="margin: 25% auto; transform: scale(2);">
        <h2 style="color: red;">Bad Login.  Try Again!</h2>
            <label for="username">Username</label><br>
            <input type="text" name="username"><br>
            <label for="password">Password</label><br>
            <input type="password" name="password"><br>
            <input type="submit" value="LOGIN" style="margin: .5rem .25rem;">
        </form>
    </div>
        `)
    }
})

//
// This scraping function will be configured to run approximately every 4 hours
// as I don't want to overstress their webhost.  This is also why I did not
// include images in this aggregator.
//
let scrapedJSON = []; // Temporary data storage.
let lastUpdated = 1635746400000; // This will be the UTC time the stores were last scraped. 
// const stores = ['CalNE', 'CalNW', 'CalSE', 'BBBC', 'Edm1', 'EdmW', 'ONHM', 'LYBC', 'ONLON', 'ONOTT', 'SKST', 'VBBC', 'BCVIC1', 'WpgW']
const stores = ['CalNE', 'CalNW', 'CalSE', 'Edm1', 'EdmW'];


// Just a small function for readability elsewhere.
const getDiscount = (reg, sale) => {
    const regex = /[$,]/gm;
    return Math.floor(100 - ((sale.replace(regex,'') / reg.replace(regex,'')) * 100));
};

// This scrapes all stores in the array provided.
const fullSendScraper = (stores) => {
    console.log('Checking if update is needed.');
    if (new Date().getTime() >= lastUpdated + 14400000) {
        console.log('Updated required.  Begin scraping.');
        // Here we'll clear the existing array and build it with new data.
        scrapedJSON.length = 0; // Reset the "database"
        lastUpdated = new Date().getTime(); // UTC data was last updated.
        stores.forEach(lmnt => {
            scrapeIt(lmnt);
        });
    } else {
        console.log('No update required.  Next Update: ' + new Date(lastUpdated + 14400000));
    }
};

// The individual store scraper.
const scrapeIt = (store) => {
    const startTime = new Date().getTime(); // Start time of function.
    axios(`https://www.memoryexpress.com/Clearance/Store/${store}`) // Open connection and get some data baby! OM NOM NOM!
        .then(res => { // Let's see what our response is...
            if (res.status === 200) { // 200 = OK!
                const html = res.data; // Get my raw HTML
                const $ = cheerio.load(html); // Process HTML in Cheerio

                // NOTE: Start collecting data
                $('.c-clli-group', html).each(function () {
                    const category = $(this).find('.c-clli-group__header-title').text().trim();
                    $(this).find('.c-clli-group__items > .c-clli-item').each(function () {
                        const title = $(this).find('.c-clli-item-info__title').text().trim();
                        const url = 'https://memoryexpress.com' + $(this).find('a').attr('href');
                        const sku = $(this).find('.c-clli-item-info__codes > span:first-child').text().trim();
                        const regularPrice = $(this).find('.c-clli-item-price__regular').text().trim();
                        const clearancePrice = $(this).find('.c-clli-item-price__clearance-value').text().trim();
                        const salePrice = $(this).find('.c-clli-item-price__sale-value').text().trim();
                        const discount = getDiscount(regularPrice, salePrice);
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
                        });
                    });
                });
            }
        }).then(() => {
            const endTime = new Date().getTime(); // End time of function.
            console.log(`(${store}) Time to complete: ${(endTime - startTime) / 1000}s (${scrapedJSON.length} items)`);  // Log time to complete function.
        }).catch(function (error) {
            console.log(`Error Code: ${error.response.status}`); // Error catching.
        });
};

// Run scraper every 10 minutes.
setInterval(() => {
    fullSendScraper(stores);
}, 600000);

// Invoke first run of 
// fullSendScraper(stores);

// Configure ExpressJS to listen for incoming connections.
app.listen(port, () => {
    console.log(`Server now listening on port: ${port}`);
});