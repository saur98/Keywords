const fs = require('fs/promises')
const checkDir = require('../helper/directory.js')
const Content = require("../schema/content.js")

module.exports = async () =>{        
        checkDir()
    const data = await Content.find({}).catch(console.log)
    var index = await fs.readFile('./client/public/index.html',{ encoding: 'utf8' });
    var css = await fs.readFile('./client/src/App.css',{ encoding: 'utf8' });
    var pages = ''
    data.map((value) => {
        var values = index.replace("</head>","<style>"+css+"</style>").replace('<div id="root"></div>',value.content).replace('<meta name="keywords" content="" />',value.SEO)
        fs.writeFile('./html-pages/'+value.Date.substring(0,13).replace(/[-T]/g,'')+'.html', values);
        pages+="<div><a href='/oldertrends/"+value.Date.substring(0,13).replace(/[-T]/g,'')+"' class='list-group-item list-group-item-action'>"+value.Date.replace(/[T]/g,' ').concat(' Hour')+"</a></div>" 
    })
    await fs.writeFile('./MyPages/pages.txt', pages,{flag : 'w'});
    index = await fs.readFile('static/temp.html',{ encoding: 'utf8' });
    const myhtml = index.replace('<div id="root"></div>',pages)  
    fs.writeFile('./MyPages/pages.html', myhtml,{flag : 'w+'});    
}
