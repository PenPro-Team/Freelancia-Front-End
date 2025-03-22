import { Button } from "react-bootstrap";
import { BASE_PATH } from "../network/API/AxiosInstance";
import { useNavigate } from "react-router-dom";
const Btn = ({ title }) => { // Destructure to easily use
    const navigate = useNavigate();
    return (
        <Button onClick={() => navigate(`${BASE_PATH}/Job_List`)} className="btn btn-info mx-auto ">{title}</Button>
    )
}

export default Btn;