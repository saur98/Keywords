import { useEffect, useState } from "react";

export default function Test(props){
    const [x,setX] = useState(false)
    const [loading,setLoading] = useState('')
    function change(){
        setLoading(true)
        setTimeout(() => {
            console.log('click')
            if(x==='x')setX('y')
            else setX('x')
            setLoading(false)
        },5000)
        
    }

    function display(){
        if(loading==='')return 
        else{
            if(loading){
                return <Progress/>
            }
            else{
                return x
            }
        }
    }

    return(
        <>
            <p>{display()}</p>
            <input type="file"/>
            <button disabled={loading} onClick={change}>Click</button>
        </>
        

    )
}

function Progress(props){
    const [count,setCount] = useState(0)
    useEffect(() =>{
        const current = count
        if(current<4){
            setTimeout(() => {
                setCount(current+1)
            },1000)
        }
    },[count])
    return(
        <progress value={count} max="4" />
    )
}