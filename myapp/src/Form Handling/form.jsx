import React, { useState } from "react";
function Form() {
    const [name,setName] = useState('');
    const [phone,setPhone] = useState('');

    function handleFormsubmit(e) {
        e.preventDefault();
        console.log(name);
        console.log(phone);
        
        
    }

    return (
        <div>
            <h1>Form Handling in React</h1>

            <form onSubmit={handleFormsubmit}>
                <div>
                    <label htmlFor="">Enter Name :</label>
                    <input type="text" value = {name} onChange={(event)=>setName(event.target.value)}/>
                </div>

                <div>
                    <label htmlFor="">Enter Phone no:</label>
                    <input type="tel" value = {phone} onChange={(e)=>setPhone(e.target.value)} />
                </div>
                <button>Submit</button>
            </form>
        </div>
    )
}



export default Form



