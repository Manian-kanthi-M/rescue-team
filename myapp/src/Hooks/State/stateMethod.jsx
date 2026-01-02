import React from "react";

class StateMethod extends React.Component {
    constructor() {
        super();
        this.state = { name:'Rahul',count:10};  //We have to declare  as a object.
    }

    handleCount() {
        this.setState(({count}) => ({count: count + 2}))
    }

    render() {
        console.log('Component Rendered');
        
        return(
            <>
            <h1>Class Component</h1>
            <h1>My Name is {this.state.name}</h1>     
            <button onClick = {() => this.setState({name:'KL Rahul'})}>Change Name</button>

            <hr />
            <h1>My count Value is {this.state.count}</h1>
            <button onClick = {this.handleCount.bind(this)}>Increase</button>
            </>
              //The bracket usage inside the html code is mentioned as interpolation.
            
           
        )
    }
}

export default StateMethod;