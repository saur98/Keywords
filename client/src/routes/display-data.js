import axios from "axios";
import { useEffect, useState } from "react";

function Displaydata(props){
    const [data,setData] = useState()
    useEffect(() => {
        axios.get("https://www.bloomberg.com/news/articles/2022-07-25/who-is-nicole-shanahan-woman-at-center-of-musk-brin-drama").then(data =>
            setData(data)
        ).catch(console.log)
    },[])

    return(
        <>
            {data}
        </>
    )
}

export default Displaydata;