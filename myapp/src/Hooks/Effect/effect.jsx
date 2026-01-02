import React, {useEffect, useState} from 'react'

function Effect() {
    let [count,setCount] = useState(100);
    let [name,setName] = useState('Rahul')
    useEffect(() => {
        console.log('Effect Hook');
        
    }, [name])

    return (
        <div>
            <h1>UseEffect Hook</h1>
            <h2>My Count value is {count}</h2>
            <button onClick = {()=>setCount(count + 10)}>Increment</button>

            <hr />
            <h2>My Name is {name}</h2>
            <button onClick = {()=>setName('Kl Rahul')}>Change Name</button>
        </div>
    )
}


export default Effect