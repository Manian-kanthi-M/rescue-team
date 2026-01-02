import React,{useState} from "react"

function FunState() {
    // let name = 'Rahul';
    
    // let [statevariableName,UpdateFunction] = useState(initialstatevalue)
    // let [name,setName] = useState('Rahul');
    let [count,setCount] = useState(100);
    console.log('Component Re Rendered');

    function handleClick() {
        for(let i = 0; i < 5; i++) {
            setCount(count + 10)
        }
    }
    


    return(
        // <div>
        //     <h1>Usestate Hook</h1>
        //     <h2>My name is {name}</h2>
        //     <button onClick={()=>setName('React-js-ver 19')}>Change Name</button>
        // </div>

        <div>
            <h1>My Count Value is {count}</h1>
            <button onClick={()=>setCount(count + 10)}>Increment</button>
            <button onClick={()=>setCount(count - 10)}>Decrement</button>
            <button onClick={()=>setCount(count * 10)}>Multi</button>
            <button onClick={()=>setCount(count / 10)}>Division</button>
        </div>
    )
}

export default FunState


// Destructuring

