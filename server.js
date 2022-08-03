const express = require('express');
const trends = require('./routes/google-trends.js')
const cors = require('cors')
const app = express()
const path = require("path")
const checkDir = require('./helper/directory.js')
const connectDB = require('./database/db.js')
const Populate = require('./helper/populate.js')
require("dotenv").config()


const port = process.env.PORT || 5000

app.use(cors())
checkDir()
connectDB()
Populate()
app.use(express.json({limit: '50mb'}))

app.use(trends)
app.use(express.static(path.join(__dirname, "client", "build")))


app.get("/oldertrends",(req,res) => {
    res.sendFile(path.join(__dirname, "MyPages", "pages.html"));
})

app.get("/oldertrends/:id",(req,res) => {
    const id = req.params.id
    //console.log(id)
    res.sendFile(path.join(__dirname, "html-pages", id+".html"));
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.get("/sitemap", (req, res) => {
    res.sendFile(path.join(__dirname, "MyPages", "sitemap.txt"));
});

app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "static","404.html"));
});

app.listen(port,() => console.log("server is running at port 8000"))
