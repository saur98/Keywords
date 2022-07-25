const { application } = require('express')
const express = require('express')
const axios = require('axios')
const fileUpload = require('express-fileupload')
const googleTrends = require('google-trends-api')

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
    console.log(trendingSearches)

    //const tree = new DOMParser().parseFromString(data)
    //const value = xpath.select('/html/body/div[3]/div[2]/div/div[2]/div/div[1]/ng-include/div/div/div/div[1]/md-list/feed-item/ng-include/div/div/div[1]/div[2]/div[1]/div/span/a',tree)
    response.status(200).json(trendingSearches)
    
});


module.exports = app