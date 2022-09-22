const express = require('express');
const trends = require('./routes/google-trends.js')
const cors = require('cors')
const app = express()
const path = require("path")
const checkDir = require('./helper/directory.js')
const connectDB = require('./database/db.js')
const Populate = require('./helper/populate.js');
const locations = require('./helper/GEO-mapping.js')
const compression = require('compression');
require("dotenv").config()


const port = process.env.PORT || 5000

app.use(cors())
app.use(compression())
//checkDir()
connectDB()
//Populate()
app.use(express.json({limit: '50mb'}))

app.use(trends)
app.use(express.static(path.join(__dirname, "client", "build")))


app.get("/oldertrends/:GEO",(req,res,next) => {
    try {
    const GEO = req.params.GEO
    var geo_name = locations.filter(data => data.GEO===GEO)[0].Name
    res.sendFile(path.join(__dirname, "MyPages",geo_name, "pages.html"));
    }
    catch(err){
       // res.status(404).sendFile(path.join(__dirname, "static","404.html"));
    //console.log(err)
    next(err)
    }
})

app.get("/oldertrends/:GEO/:id",(req,res,next) => {
    try{
    const id = req.params.id
    const GEO = req.params.GEO
    var geo_name = locations.filter(data => data.GEO===GEO)[0].Name
    //console.log(id)
    res.sendFile(path.join(__dirname, "html-pages", geo_name, id+".html"));
    }
    catch(err){
        //res.status(404).sendFile(path.join(__dirname, "static","404.html"));
        next(err)
    }
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "static","contact.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "static","about.html"));
});

app.get("/privacy", (req, res) => {
    res.sendFile(path.join(__dirname, "static","privacy-policy.html"));
});

app.get("/disclaimer", (req, res) => {
    res.sendFile(path.join(__dirname, "static","disclaimer.html"));
});

app.get("/sitemap.xml", async(req, res) => {
    await Populate();
    res.sendFile(path.join(__dirname, "MyPages", "sitemap.xml"));
});

app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "static","404.html"));
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(404).sendFile(path.join(__dirname, "static","404.html"));
  })

app.listen(port,() => console.log("server is running at port 8000"))
