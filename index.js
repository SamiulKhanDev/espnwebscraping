const request = require('request');
const cheerio = require('cheerio');
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const extractData = require("./scorecard");
const extractLink = require("./allMatches")
request(url, callback);
function callback(error, response, html)
{
    if (error)
    {
        console.log(error);  
    }
    else
    {
        
        extractLink(html);
    }
}