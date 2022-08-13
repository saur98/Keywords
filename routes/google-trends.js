const express = require('express')
const axios = require('axios')
const googleTrends = require('google-trends-api')
const cheerio = require('cheerio')
const Trends = require("../schema/trending.js")
const Content = require("../schema/content.js")
const fs = require('fs/promises');
const Populate = require('../helper/populate.js')
const keyword_extractor = require("keyword-extractor");
const Test = require('../schema/test.js')
const locations = require('../helper/GEO-mapping.js')

const app = express()


app.get("/api/dailytrends/:GEO", async (request, response) => {
    try{
    const GEO = request.params.GEO
    //console.log(GEO)
    var language = locations.filter(data => data.GEO===GEO)[0].Language
    //console.log(GEO)
    const trends_now = await Trends.findOne({GEO : GEO}).sort({createdAt : -1})
    var date = new Date()
    date.setHours(date.getHours() - 1);
    //const progress = !trends_now || (!trends_now?false:trends_now.createdAt < date)
    const progress = true
    if(!progress){response.status(200).json({values:trends_now,html:false})}
    else{
        response.status(200).json({values:trends_now,html:true})
    const data = await googleTrends.dailyTrends({ geo: GEO })
    //console.log(data)
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
    let str = []
    let str_keyword = []
    let i,j 
    for (i in trendingSearches) {
        for (j in trendingSearches[i]['trendingSearches']) {
            try {
                let URL = trendingSearches[i]['trendingSearches'][j].URL
                let query = trendingSearches[i]['trendingSearches'][j].query

                let {data} = await axios.get(URL).catch()
                let $ = cheerio.load(data)
                let t = $('p').contents().map(function() {
                    let value = (this.type === 'text') ? $(this).text()+' ' : '';
                    if(value.length>10)return value
                }).get();
                var extraction_result = keyword_extractor.extract(t.join(''),{
                    language:language,
                    remove_digits: true,
                    return_changed_case:true,
                    remove_duplicates: false,
                    return_chained_words : true
                });
                str.push({query:query,keywords:getMax(extraction_result,10)})
                for(var p of t){
                    str_keyword.push(p)
                }
                
                
            }
            catch (err) { console.log(err) }
        }
    }
    const d = date.toISOString().substring(0,13)
    var extraction_result = keyword_extractor.extract(str_keyword.join(''),{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false
    });
   
await Trends.findOneAndUpdate({Date : d,GEO: GEO},{GEO:GEO,trends : trendingSearches,content : str,keywords : getMax(extraction_result,10),Date : d},{upsert:true})
//console.log("updated")
    }
    }
    catch(err){
        console.log(err)
    }
    //response.status(200).json(trendingSearches)

});

function getMax(data, n) {
    var tmp = {}, tops = [];
  
    // Create object with count of occurances of each array element
    data.forEach(function(item) {
        tmp[item] = tmp[item] ? tmp[item]+1 : 1;
    });
  
    // Create an array of the sorted object properties
    tops = Object.keys(tmp).sort(function(a, b) { return tmp[a] - tmp[b] });
  
    // Return last n elements in reverse order
    return tops.slice(-(n)).reverse();
}

app.post("/api/html/:GEO",async (request,response) => {
    try{
    const GEO = request.params.GEO
    var geo_name = locations.filter(data => data.GEO===GEO)[0].Name
    //console.log(GEO,locations)
    var index = await fs.readFile('./client/public/index.html',{ encoding: 'utf8' });
    var css = await fs.readFile('./client/src/App.css',{ encoding: 'utf8' });
    var html = request.body.html.replace('id="location"','id="location" disabled="true"')
    var SEO = '<meta name="keywords" content="'+request.body.SEO+'" />'
    //console.log(html)
    var values = index.replace("</head>","<style>"+css+"</style>").replace('<div id="root"></div>',html).replace('<meta name="keywords" content="" />',SEO)
    const date = new Date()
    const d_upload = date.toISOString().substring(0,13)
    await Content.findOneAndUpdate({Date : d_upload,GEO : GEO},{GEO : GEO,content:values,Date:d_upload,SEO : SEO},{upsert:true})

    const d = date.toISOString().substring(0,13).replace(/[-T]/g,'')
    await fs.writeFile('./html-pages/'+geo_name+'/'+d+'.html', values);
    var myhtml = await fs.readFile('./MyPages/'+geo_name+'/pages.txt',{ encoding: 'utf8' });

    const d_display = date.toISOString().substring(0,13).replace(/[T]/g,' ').concat(' Hour')
    if(!myhtml.includes(d)){
    const url = "<div><a href='/oldertrends/"+GEO+'/'+d+"' class='list-group-item list-group-item-action'>"+d_display+"</a></div>"
    await fs.writeFile('./MyPages/'+geo_name+'/pages.txt', myhtml+url,{flag : 'w'});
    index = await fs.readFile('static/temp.html',{ encoding: 'utf8' });
    const pages = index.replace('<div id="root"></div>',myhtml+url)  
    await fs.writeFile('./MyPages/'+geo_name+'/pages.html', pages,{flag : 'w'});
    }
    var sitemap = await fs.readFile('./MyPages/sitemap.xml',{ encoding: 'utf8' });
    var site = `<url>
        <loc>https://popular-trends.herokuapp.com/oldertrends/`+geo_name+'/'+d + `</loc>
        <lastmod>`+date.toISOString().substring(0,10)+`</lastmod>
    </url>`    
    if(!sitemap.includes(site))
    {
        let map = sitemap.replace('</urlset>',site+'</urlset>')
        await fs.writeFile('./MyPages/sitemap.xml', map,{flag : 'w'});
    }
    }
    catch(err){
        console.log(err)
    }   
    response.end()  
})

app.get("/api/populate",async (request,response) => {
    try{
        await Populate()
    }
    catch(err){
        console.log(err)
    }
    response.send("POPULATED")
})

app.get("/api/delete",(request,response) => {
    // Trends.findOneAndDelete().sort({createdAt : -1})
    // Content.findOneAndDelete().sort({createdAt : -1})
    const data = Test.findOneAndDelete({},{sort: { createdAt: -1 }})
    console.log(data)
    response.end()
})


module.exports = app