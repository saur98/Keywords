const express = require('express')
const axios = require('axios')
const googleTrends = require('google-trends-api')
const cheerio = require('cheerio')

const app = express()

app.get("/api/dailytrends", async (request, response) => {
    const data = await googleTrends.dailyTrends({ geo: "US" })
    const searches = []
    const datas = JSON.parse(data).default.trendingSearchesDays
    trendingSearchesDays = datas.map(data => {
        return { date: data.date, dateformatted: data.formattedDate, trendingSearches: data.trendingSearches }
    })
    const trendingSearches = trendingSearchesDays.map(data => {
        for (key in data) {
            if (key === 'trendingSearches') {
                data[key] = data[key].map(data => {
                    return { query: data.title.query, URL: data.image.newsUrl }
                })
            }
        }
        return data
    })

    response.status(200).json(trendingSearches)

});

app.post("/api/link", async (request, response) => {
    const trendingSearch = request.body.trendingSearch
    let str = ''
    let i,j 
    for (i in trendingSearch) {
        for (j in trendingSearch[i]['trendingSearches']) {
            try {
                let URL = trendingSearch[i]['trendingSearches'][j].URL
                
                let {data} = await axios.get(URL,{timeout :500})
                let $ = cheerio.load(data)
                let t = $('p').contents().map(function() {
                    return (this.type === 'text') ? $(this).text()+' ' : '';
                }).get().join('');
                str += t
                
            }
            catch (err) { console.log(err) }
        }
    }
    //console.log(str)
    response.send(str)
})


module.exports = app