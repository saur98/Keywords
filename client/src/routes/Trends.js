import axios from 'axios'
import { useState, useEffect } from 'react'
import '.././App.css';


function Trends(props) {
    const [searches, setSearches] = useState([])
    const [content, setContent] = useState()
    useEffect(() => {
        const URL = "/api/dailytrends"
        
        async function calls(){
            const trends = await axios.get(URL).catch()
            setSearches(trends) 
            const content = await axios.post("/api/content", { id: trends.data.values._id }).catch()
            setContent(content.data)
            setTimeout(() => {
                if(trends.data.html)
            {
                const MyHtml = document.getElementById("root").innerHTML
                axios.post("/api/html",{html:MyHtml}).catch()
            }
            },0)
        }
        calls()

        



    }, [])

    function displaysearch() {
        //console.log(searches)
        if (searches.data){
            return searches.data.values.trends.map(data => {
                return <Today value={data} />
            })
        }
    }



    return (
        <>
            {displaysearch()}
            <a href="/oldertrends">OLDER TRENDS BY DATETIME</a>
            <br />
            <a href="/">Home</a>
            <div className="content" >{content?content:<progress />}</div>
            
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
            <h1>{date()}</h1>
            <h6 className="searches">{values()}</h6>
        </>
    )
}

export default Trends;