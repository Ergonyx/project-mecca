const axios = require('axios') // For the request to scrape
const cheerio = require('cheerio') // For the DOM manipulation
const {text} = require('cheerio/lib/api/manipulation')
const {compareDocumentPosition} = require('domutils')
const express = require('express') // For the routing/api stuff

const app = express()
