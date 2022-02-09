// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function proceesScoreCard(url)
{
    request(url, callback);
}



function callback(error, response, html)
{
    if (error)
    {
        console.log(error);
    }
    else
    {
        extractData(html);    
    }
}


function extractData(html)
{
    const $ = cheerio.load(html);
    const description= $(".header-info .description").text().split(",");
    const venue = description[1].trim();
    const date = description[2].trim();
    const result = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text").text();
    // const teamsName = $('a[class="name-link"]');
    // console.log(venue);
    // console.log(date);
    // console.log(result);
    
    const innings = $(".card.content-block.match-scorecard-table .Collapsible");
    let htmlString = "";
    // let idx = 0;
    for (let i = 0; i < 2;i++)
    {
        htmlString += $(innings[i]).html();    
        const teamName = $(innings[i]).find("h5").text().split("INNINGS")[0].trim();
        const oIndex = (i == 0 ? 1 : 0);
        const opponentName = $(innings[oIndex]).find("h5").text().split("INNINGS")[0].trim();
        // console.log(teamName+" "+opponentName);
       
        
        let allRows = $(innings[i]).find('.table.batsman tbody tr');
        
        for (let j = 0; j < allRows.length; j++)
        {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if (isWorthy)
            {
                let playerName = $(allCols[0]).text();
                let runs = $(allCols[2]).text();
                let balls = $(allCols[3]).text();
                let fours = $(allCols[5]).text();
                let six = $(allCols[6]).text();
                let str = $(allCols[7]).text();
                // console.log(playerName +" "+runs+" "+balls+" "+fours+" "+six+" "+str);
                let details = {
                    "Name": playerName,
                    "TeamName": teamName,
                    "OpponentTeamName": opponentName,
                    "Runs": runs,
                    "Balls": balls,
                    "Four": fours,
                    "Six": six,
                    "StrickRate":str,
                }

                processPlayerDetails(details);

            }
        }

  
      
    }

}

function processPlayerDetails(obj)
{
    let teamNameFolder = path.join(__dirname, "IPL", obj.TeamName);
    createDir(teamNameFolder);
    let filePath = path.join(teamNameFolder , obj.Name+ ".xlsx")
    let content = excelReader(filePath, obj.Name);
    content.push(obj);
    excelWriter(filePath , content ,  obj.Name)
}

function createDir(dirPath)
{
    if (fs.existsSync(dirPath) == false)
    {
        fs.mkdirSync(dirPath);    
    }
}


function excelWriter(filePath, jsonData, sheetName) {
    let newWB = xlsx.utils.book_new();
    // Add new WorkBook
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    // This will take JSON and will convert into Excel Format
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
  }
  
  function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
      return [];
    }
  
    let wb = xlsx.readFile(filePath);
    // which excel file to read
    let excelData = wb.Sheets[sheetName];
    // pass the sheet Name
    let ans = xlsx.utils.sheet_to_json(excelData);
    // conversion from sheet to JSON
    return ans;
  }
  


module.exports = proceesScoreCard;