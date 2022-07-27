const express = require('express')
const axios = require('axios')
const googleTrends = require('google-trends-api')
const puppeteer = require('puppeteer')

const app = express()

app.get("/api/dailytrends", async (request, response) => {
    const data = await googleTrends.dailyTrends({ geo: "US" })
    console.log(typeof data)
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
    for (i in trendingSearch) {
        for (j in trendingSearch[i]['trendingSearches']) {
            let values = []
            try {
                const URL = trendingSearch[i]['trendingSearches'][j].URL
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox']
                }).catch(err => console.log)
                console.log("hi",await puppeteer.launch())
                const page = await browser.newPage().catch(err => console.log)
                await page.goto(URL, { waitUntil: 'domcontentloaded' }).catch(err => console.log)
                const pTags = await page.$$("p").catch(err => console.log)

                if (pTags.length > 0) {

                    for (ptag in pTags) {
                        let value = await pTags[ptag].evaluate(el => el.textContent).catch(err => console.log)
                        values.push(value)
                    }
                }
                response.write(values.toString())
                browser.close()
            }
            catch (err) { console.log(err) }
        }


    }



    response.end()
})


module.exports = app