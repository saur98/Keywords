const express = require('express');
const connectDB = require('./database/db.js')
const trends = require('./routes/google-trends.js')
const cors = require('cors')
const app = express()
const path = require("path")
require("dotenv").config()


const port = process.env.PORT || 5000

app.use(cors())
//connectDB()

app.use(trends)
app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port,() => console.log("server is running at port 8000"))
