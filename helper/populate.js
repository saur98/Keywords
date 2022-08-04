const fs = require('fs/promises')
const checkDir = require('../helper/directory.js')
const Content = require("../schema/content.js")

module.exports = async () =>{        
        checkDir()
    const data = await Content.find({}).catch(console.log)
    var index = await fs.readFile('./client/public/index.html',{ encoding: 'utf8' });
    var css = await fs.readFile('./client/src/App.css',{ encoding: 'utf8' });
    var pages = ''
    var sitemap = ''
    data.map((value) => {
        const filename = value.Date.substring(0,13).replace(/[-T]/g,'')
        var values = index.replace("</head>","<style>"+css+"</style>").replace('<div id="root"></div>',value.content).replace('<meta name="keywords" content="" />',value.SEO)
        fs.writeFile('./html-pages/'+filename+'.html', values);
        pages+="<div><a href='/oldertrends/"+filename+'\r\n'+"' class='list-group-item list-group-item-action'>"+value.Date.replace(/[T]/g,' ').concat(' Hour')+"</a></div>" 
        sitemap+=`<url>
            <loc>https://popular-trends.herokuapp.com/oldertrends/`+filename+'\r\n' + `\r\n</loc>
            <lastmod>`+value.Date.substring(0,10)+`</lastmod>
                </url>`
    })
    sitemap_content = `<?xml version="1.0" encoding="UTF-8"?>

    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ` + sitemap + `</urlset> `
    await fs.writeFile('./MyPages/pages.txt', pages,{flag : 'w'});
    await fs.writeFile('./MyPages/sitemap.xml', sitemap_content,{flag : 'w+'});
    index = await fs.readFile('static/temp.html',{ encoding: 'utf8' });
    const myhtml = index.replace('<div id="root"></div>',pages)  
    fs.writeFile('./MyPages/pages.html', myhtml,{flag : 'w+'});    
}
