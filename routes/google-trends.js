const { application } = require('express')
const express = require('express')
const axios = require('axios')
const fileUpload = require('express-fileupload')
const googleTrends = require('google-trends-api')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const app = express()
app.use(fileUpload());

app.get("/api/dailytrends",async (request,response) => {
    const data = await googleTrends.dailyTrends({ geo: "US" })
    console.log(typeof data)
    const searches = []
    const datas = JSON.parse(data).default.trendingSearchesDays
    trendingSearchesDays = datas.map(data => {     
        return {date:data.date,dateformatted:data.formattedDate,trendingSearches:data.trendingSearches}
    })
    const trendingSearches = trendingSearchesDays.map(data => {
        for(key in data){
                if(key==='trendingSearches')
                {
                    data[key] = data[key].map(data => {
                        return {query:data.title.query,URL:data.image.newsUrl}
                    })
                }
        }
        return data
    })
    
    response.status(200).json(trendingSearches)
    
});

app.post("/api/link",async (request,response) => {
    //console.log(request.body.trendingSearch)
    const trendingSearch = request.body.trendingSearch
    try{
   
    
    for (i in trendingSearch){
        for(j in trendingSearch[i]['trendingSearches']){
            let values = []
            const URL = trendingSearch[i]['trendingSearches'][j].URL
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
    try{await page.goto(URL,{waitUntil : 'domcontentloaded'})} catch(err) { console.log}
    const pTags = await page.$$("p");
    
    if(pTags.length > 0){
    let value = await pTags[0].evaluate(el => el.textContent)
    
    for(ptag in pTags)
    {   
        let value = await pTags[ptag].evaluate(el => el.textContent)
        values.push(value)
    }
    }
    //console.log(values)
    response.write(values.toString())
    browser.close()
    }
    
    }
    
    }
    catch(err){console.log(err)}
    response.end()
})


module.exports = app