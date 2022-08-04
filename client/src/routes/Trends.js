import axios from 'axios'
import { useState, useEffect } from 'react'
import '.././App.css';
import '../ads/ads.js'
import home_add from '../ads/ads.js';


function Trends(props) {
    const [country, setCountry] = useState({Name : "United States" , GEO : "US"})
    const [searches, setSearches] = useState([])
    const [content, setContent] = useState()
    const [keywords, setKeywords] = useState()
    useEffect(() => {

        async function calls() {
            console.log(country.GEO)
            const trends = await axios.get("/api/dailytrends/"+country.GEO).catch()
            setSearches(trends)
            setContent(trends.data.values.content)
            setKeywords(trends.data.values.keywords)
            setTimeout(() => {
                if (trends.data.html) {
                    const MyHtml = document.getElementById("root").innerHTML
                    axios.post("/api/html/"+country.GEO, { html: MyHtml, SEO: trends.data.values.trends[0]['trendingSearches'][0]['query'] }).catch()
                }
            }, 0)
        }
        calls();




    }, [country])

    function displaysearch() {
        //console.log(searches)
        if (searches.data) {
            return searches.data.values.trends.map(data => {
                return <Today value={data} />
            })
        }
    }

    function getContent() {
        if (content) {
            return (content.map(data => {
                return <Content value={data} />
            }))
        }
    }

    function getGeoCodes(){
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
        const location_list = locations.map(data => {
            return <option value={data.GEO}>{data.Name}</option>
        })
        return (location_list)
    }

    function changeGeo(event){
        let Name = event.target.options[event.target.selectedIndex].text
        let GEO = event.target.value
        setCountry({Name,GEO})
    }


    return (
        <>
            <div class='navigation'>
                <div class='items'><a href="/oldertrends">OLDER TRENDS</a></div>
                <div ><h1 >TRENDING NOW</h1></div>
                <div class='items'><a href="/">Home</a></div>
            </div>
            <div className="data">
                <div className="main">
                    <div className='title'>
                        <h2>{country.Name}</h2>
                        <select name="location" id="location" onChange={changeGeo}>
                            {getGeoCodes()}
                        </select>
                    </div>
                    <hr />
                    {displaysearch()}
                </div>
                <div className='keyword'>{keywords && <Keywords value={keywords} />}</div>
            </div>
            <br />

            <div className="content" >{content ? getContent() : <progress />}</div>
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
        return trendingSearches.map(data => <div className='search' key={data.query}><a href={data.URL} >{data.query}</a></div>)
    }

    return (
        <>
            <div className="sub">
                <h2 className='title'>{date()}</h2>
                <h6 className="searches">{values()}</h6>
            </div>
        </>
    )
}

function Keywords(props) {
    //console.log(props.value)
    function display() {
        return (
            props.value.map(data => {
                if (data !== "—") {
                    return <h2>{data}</h2>
                }
                else {
                    return ''
                }
            })
        )
    }

    return (
        <>
            <h2 className='title'>Top Keywords</h2><br /><hr />
            <h6 className='keywords'>{display()}</h6>
        </>
    )
}

function Content(props) {
    const query = props.value.query
    const display = props.value.value.map(data => { return <p>{data}</p> })
    return (
        <>
            <div className='Content' >
                <div className='Content-Title'><h1>{query}</h1></div>
                <hr />
                <div className='Content-Display'>{display}</div>
            </div>
        </>
    )
}
export default Trends;