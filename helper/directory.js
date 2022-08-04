const fs = require('fs/promises');

module.exports = () => {
    fs.mkdir('./MyPages', { recursive: true }, (err) => {
        if (err) throw err;
    }).then(() => {
        fs.writeFile('./MyPages/pages.txt','',{flag:'w+'}).catch(console.log)
        fs.writeFile('./MyPages/sitemap.xml','',{flag:'w+'}).catch(console.log)
    });
    fs.mkdir('./html-pages', { recursive: true }, (err) => {
        if (err) throw err;
    });
    
}



