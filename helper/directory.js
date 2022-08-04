const fs = require('fs/promises');

const locations = [
    {Name : "United States" , GEO : "US"},
    {Name : "India" , GEO : "IND"},
    {Name : "Australia" , GEO : "AUS"},
    {Name : "Canada" , GEO : "CAN"},
    {Name : "Marshal islands" , GEO : "MHL"},
    {Name : "United Kingdom" , GEO : "ENG"},
    {Name : "Germany" , GEO : "GER"},
    {Name : "Switzerland" , GEO : "SUI"},
    {Name : "Brazil" , GEO : "BRA"},
    {Name : "New Zealand" , GEO : "NZL"},
    {Name : "Italy" , GEO : "ITA"}
    ]
module.exports = () => {
    fs.mkdir('./MyPages', { recursive: true }, (err) => {
        if (err) throw err;
    }).then( () => {
        locations.map(async (data) => {
            await fs.mkdir('./MyPages/'+data.Name, { recursive: true })
            await fs.writeFile('./MyPages/'+data.Name+'pages.txt','',{flag:'w+'}).catch(console.log)
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



