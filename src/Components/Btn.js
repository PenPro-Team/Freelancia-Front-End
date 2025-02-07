import { Button } from "react-bootstrap";

const Btn = ({title}) => { // Destructure to easily use
    
    return (
        <Button className="btn btn-info mx-auto ">{title}</Button>
    )
}

export default Btn;