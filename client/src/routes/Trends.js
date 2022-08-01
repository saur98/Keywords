import axios from 'axios'
import { useState, useEffect } from 'react'
import '.././App.css';
import '../ads/ads.js'
import home_add from '../ads/ads.js';


function Trends(props) {
    const [searches, setSearches] = useState([])
    const [content, setContent] = useState()
    useEffect(() => {
        const URL = "/api/dailytrends"
        
        async function calls(){
            const trends = await axios.get(URL).catch()
            setSearches(trends) 
            const contents = await axios.post("/api/content", { id: trends.data.values._id }).catch()
            setContent(contents.data)
            setTimeout(() => {
                if(trends.data.html)
            {
                const MyHtml = document.getElementById("root").innerHTML
                axios.post("/api/html",{html:MyHtml}).catch()
            }
            },0)
        }
        calls();
        



    }, [])

    function displaysearch() {
        //console.log(searches)
        if (searches.data){
            return searches.data.values.trends.map(data => {
                return <Today value={data} />
            })
        }
    }

    function getContent(){
        console.log(content)
        const display = content.map(data => { return <p>{data}</p> })
        return display
    }



    return (
        <>
            <div className="title">
            <h1>TRENDING NOW</h1>
            <h2>Globally</h2>
            </div>
            {displaysearch()}
            <a href="/oldertrends">OLDER TRENDS BY DATETIME</a>
            <br />
            <a href="/">Home</a>
            <div className="content" >{content?getContent():<progress />}</div>
            {home_add()}
        </>
    )

}

function Today(props) {
    const { dateformatted, trendingSearches } = props.value
    //console.log(dateformatted)
    const date = () => {
        return dateformatted
    }

    const values = () => {
        //console.log(trendingSearches)
        return trendingSearches.map(data => <div key={data.query}><a href={data.URL} >{data.query}</a></div>)
    }

    return (
        <>
            <h2 className='title'>{date()}</h2>
            <h6 className="searches">{values()}</h6>
        </>
    )
}

export default Trends;