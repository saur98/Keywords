import axios from 'axios'
import {useState,useEffect} from 'react'
import '.././App.css';


function Trends(props){
    const [searches,setSearches] = useState([])
    const [content,setContent] = useState([])
    useEffect(() => {
        const URL = "/api/dailytrends"
        const config = {
            onDownloadProgress : function(progressEvent){
                
                setContent(progressEvent.srcElement.response)
            }
        }
        
        axios.get(URL).then( data => {
            console.log(data)
            setSearches(data)
            axios.post("/api/link",{trendingSearch:data.data} ,config).then(data=> {
                const {values} = data
                console.log(values)
                
            })   
        })
        .catch( err => console.log(err))

        
      

    },[])

    function displaysearch(){ 
            if(searches.data)
            return searches.data.map(data => {
                return <Today value={data}/>
            })       

        }

    
    return(
        <>
        {displaysearch()}
        <div className="content" >{content}</div>
        </>
    )

}

function Today(props){
    const {dateformatted,trendingSearches} = props.value
    //console.log(dateformatted)
    const date = () => {
        return dateformatted
    }

    const values = () => {
        return trendingSearches.map(data => <div><a href={data.URL} >{data.query}</a></div>)
    }

    return (
        <>
        <h1>{date()}</h1>
        <h6 className="searches">{values()}</h6>
        </>
    )
}

export default Trends;