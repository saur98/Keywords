const fs = require('fs/promises');
const locations = require('./GEO-mapping.js')
module.exports = () => {
    fs.mkdir('./MyPages', { recursive: true }, (err) => {
        if (err) throw err;
    }).then( () => {
        locations.map(async (data) => {
            await fs.mkdir('./MyPages/'+data.Name, { recursive: true })
            await fs.writeFile('./MyPages/'+data.Name+'/pages.txt','',{flag:'w+'}).catch(console.log)
        })
        fs.writeFile('./MyPages/sitemap.xml','',{flag:'w+'}).catch(console.log)
    });
    fs.mkdir('./html-pages', { recursive: true }, (err) => {
        if (err) throw err;
    }).then(() => {
        locations.map(data => {
            fs.mkdir('./html-pages/'+data.Name, { recursive: true })
        })
    });
    
}



