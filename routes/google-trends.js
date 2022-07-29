const express = require('express')
const axios = require('axios')
const googleTrends = require('google-trends-api')
const cheerio = require('cheerio')
const Trends = require("../schema/trending.js")
const content = require("../schema/content.js")
const fs = require('fs/promises');

const app = express()

app.get("/api/dailytrends", async (request, response) => {
    try{
    const trends_now = await Trends.findOne().sort({createdAt : -1})
    var date = new Date()
    date.setHours(date.getHours() - 1);
    const progress = !trends_now || (!trends_now?false:trends_now.createdAt < date)
    if(!progress){response.status(200).json({values:trends_now,html:false})}
    else{
        response.status(200).json({values:trends_now,html:true})
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
    let str = ''
    let i,j 
    for (i in trendingSearches) {
        for (j in trendingSearches[i]['trendingSearches']) {
            try {
                let URL = trendingSearches[i]['trendingSearches'][j].URL
                
                let {data} = await axios.get(URL).catch()
                let $ = cheerio.load(data)
                let t = $('p').contents().map(function() {
                    return (this.type === 'text') ? $(this).text()+' ' : '';
                }).get().join('');
                str += t
                
            }
            catch (err) { console.log(err) }
        }
    }

    let trend = new Trends({trends : trendingSearches,content : str})
    await trend.save()
    await Trends.findByIdAndDelete(trends_now._id)
    }
    }
    catch(err){
        console.log(err)
    }
    //response.status(200).json(trendingSearches)

});

app.post("/api/content", async (request, response) => {
    try{
    const id = request.body.id
    
    const content_now = await Trends.findOne({_id : id},{content:1, _id:0})
    //console.log(content_now)
    response.send(content_now.content)
    }
    catch(err){
        console.log(err)
    }
    //console.log(str)
    
})

app.post("/api/html",async (request,response) => {
    
    var index = await fs.readFile('./client/public/index.html',{ encoding: 'utf8' });
    const css = await fs.readFile('./client/src/App.css',{ encoding: 'utf8' });
    const html = request.body.html
    index = index.replace("</head>","<style>"+css+"</style>").replace('<div id="root">',html)
    
    //console.log(index)
    const d = Date.now()
    await fs.writeFile('./html-pages/'+d+'.html', index,{ flag: 'a' });
    const date_format = new Date(d)
    const url = "<a href='/oldertrends/"+d+"'>"+date_format+"</a><br>"
    await fs.writeFile('./MyPages/pages.html', url,{ flag: 'a+' });  
    response.end()  
})


module.exports = app