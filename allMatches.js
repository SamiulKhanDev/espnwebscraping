const request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");
const path = require("path");
const proceesScoreCard = require("./scorecard");

const dirPath = path.join(__dirname, "IPL");

createDir(dirPath);


function extractLink(html)
{
    const $ = cheerio.load(html);
    const anchorElement = $('a[data-hover="View All Results"]');
    const link = anchorElement.attr("href");
    const homapageLink = "https://www.espncricinfo.com";
    const fullLink = homapageLink.concat(link);
    getAllMatchesList(fullLink);
}
function getAllMatchesList(fullLink)
{
    request(fullLink, function (error, response, html)
    {
        if (error)
        {
            console.log(error);
        }
        else
        {
            const $ = cheerio.load(html);
            const scoreCardList = $('a[data-hover="Scorecard"]');
            const homepageLink = "https://www.espncricinfo.com";
            for (let scoreCard of scoreCardList)
            {
                const link = homepageLink.concat($(scoreCard).attr("href"));
                proceesScoreCard(link);
            }
        }
    })
}

function createDir(dirPath)
{
    if (fs.existsSync(dirPath) == false)
    {
        fs.mkdirSync(dirPath);    
    }
}

module.exports = extractLink;