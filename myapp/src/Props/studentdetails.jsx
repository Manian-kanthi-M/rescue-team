import Student from "./student";

function StudentDetails() {
    let name = 'Mani'
    return(
        <>
        <h1>StudentDetails</h1>
        <Student data = {name}></Student>
        </>
    )
}

export default StudentDetails;