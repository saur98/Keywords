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
    let values = []
    for (i in trendingSearch) {
        for (j in trendingSearch[i]['trendingSearches']) {
            try {
                const URL = trendingSearch[i]['trendingSearches'][j].URL
                const {data} = await axios.get(URL)
                const $ = cheerio.load(data)
                var t = $('p').contents().map(function() {
                    return (this.type === 'text') ? $(this).text()+' ' : '';
                }).get().join('');
                values.push(t)
                
            }
            catch (err) { console.log(err) }
        }
    }



    response.send(values.toString())
})


module.exports = app