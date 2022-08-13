import axios from 'axios'
import { useState, useEffect } from 'react'
import '.././App.css';


function Trends(props) {
    const [country, setCountry] = useState({Name : "United States" , GEO : "US"})
    const [searches, setSearches] = useState([])
    const [content, setContent] = useState()
    const [keywords, setKeywords] = useState()
    useEffect(() => {

        async function calls() {
            //console.log(country.GEO)
            const trends = await axios.get("/api/dailytrends/"+country.GEO).catch()
            setSearches(trends)
            setContent(trends.data.values.content)
            setKeywords(trends.data.values.keywords)
            setTimeout(() => {
                if (trends.data.html) {
                    const MyHtml = document.getElementById("root").innerHTML
                    axios.post("/api/html/"+country.GEO, { html: MyHtml}).catch()
                }
            }, 0)
        }
        calls();




    }, [country])

    function displaysearch() {
        //console.log(searches)
        if (searches.data) {
            return searches.data.values.trends.map(data => {
                return <div key={data.dateformatted}><Today value={data} /></div>
            })
        }
    }

    function getContent() {
        if (content) {
            return (content.map(data => {
                return <div key={data.query}><Content value={data}/></div>
            }))
        }
    }

    function getGeoCodes(){
        const locations = [
            {Name : "United States" , GEO : "US"},
            {Name : "India" , GEO : "IN"},
            {Name : "Australia" , GEO : "AU"},
            {Name : "Canada" , GEO : "CA"},
            {Name : "Germany" , GEO : "DE"},
            {Name : "Switzerland" , GEO : "CH"},
            {Name : "Brazil" , GEO : "BR"},
            {Name : "New Zealand" , GEO : "NZ"},
            {Name : "Italy" , GEO : "IT"}
            ]
        const location_list = locations.map(data => {
            return <option key={data.GEO} value={data.GEO}>{data.Name}</option>
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
            <div className='navigation'>
                <div className='items'><a href={'/oldertrends/'+country.GEO}>OLDER TRENDS</a></div>
                <div ><h1 >TRENDING NOW</h1></div>
                <div className='pages'>
                    
                        <div className='home'><a href="/">Home</a></div>
                        <div className='contact-about'>
                            <div><a href="/contact">Contact Us</a></div>
                            <br />
                            <div><a href="/about">About Us</a></div>
                        </div>
                    
                </div>
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

            <div className='contents content'>
                {content ? getContent() : <progress />}
            </div>
            <div><a href="/disclaimer">Disclaimer</a></div>
            <div><a href="/privacy">Privacy-Policy</a></div>

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
        return trendingSearches.map(data => <div className='search' key={data.query}><a key={data.URL} href={data.URL} >{data.query}</a></div>)
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
                    return <h2 key={data}>{data}</h2>
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
            <div className='keywords'>{display()}</div>
        </>
    )
}

function Content(props) {
    const query = props.value.query
    const keyword = props.value.keywords
    var c=0
    //const display = props.value.value.map(data => { return <p key={c++}>{data}</p> })
    return (
        <>
            <Ads />
            
            <div className='Content' >
                <div className='Content-Title'><h1>{query}</h1></div>
                <div className='keyword content-keyword'><Keywords value={keyword} /></div>    
            </div>
        
        </>
    )
}


function Ads(){
    return (
        <>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2654188388870545"
     crossOrigin="anonymous"></script>
<ins className="adsbygoogle"
     style={{display:'block'}}
     data-ad-client="ca-pub-2654188388870545"
     data-ad-slot="3286634896"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</>
    )
}
export default Trends;