function Table() {
    return (
        <>
        <h1>Table</h1>
        <table border={1}>
            <Tablehead />
            <Tablebody />
        </table>
        
        </>

    )
}

function Tablehead() {
    return(
        <>
        <thead>
            <tr>
                <th>RollNo</th>
                <th>Name</th>
                
            </tr>
        </thead>
        </>
    )
}

function Tablebody() {
    return(
        <>
        <tbody>
            <td>1</td>
            <td>Rahul</td>
        </tbody>
        </>
    )
}

export default Table;