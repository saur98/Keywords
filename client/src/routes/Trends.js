import axios from 'axios'
import { useState, useEffect } from 'react'
import '.././App.css';


function Trends(props) {
    const [searches, setSearches] = useState([])
    const [content, setContent] = useState()
    useEffect(() => {
        const URL = "/api/dailytrends"
        // const config = {
        //     onDownloadProgress: function (progressEvent) {
        //         setContent(progressEvent.srcElement.response)
        //     }
        // }

        axios.get(URL).then(data => {
            setSearches(data)
            axios.post("/api/link", { id: data.data._id }).then(
                data => {
                    setContent(data.data)
                }
            ).catch(err => console.log(err))
        })
            .catch(err => console.log(err))




    }, [])

    function displaysearch() {
        //console.log(searches)
        if (searches.data){
            return searches.data.trends.map(data => {
                return <Today value={data} />
            })
        }
    }

    // function displaycontent(){
    //     console.log("hi")
    //     async function getdata(){
    //         const trendingSearch = searches.data
    //         var i,j = ''
    //         for (i in trendingSearch) {
    //             for (j in trendingSearch[i]['trendingSearches']) {
    //                 const prev = content
    //                 try {
    //                     const URL = trendingSearch[i]['trendingSearches'][j].URL
    //                     const {data} = await axios.get(URL)
    //                     console.log(data)
    //                     const $ = cheerio.load(data)
    //                     var t = $('p').contents().map(function() {
    //                         return (this.type === 'text') ? $(this).text()+' ' : '';
    //                     }).get().join('');
    //                     //console.log(t)
    //                     setContent(prev+t)
    //                 }
    //                 catch (err) { console.log(err) }
    //             }
    //         }        
    //     }
    //     getdata()
    // }


    return (
        <>
            {displaysearch()}
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