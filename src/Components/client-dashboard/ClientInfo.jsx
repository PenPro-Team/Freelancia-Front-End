import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Row, Col, Placeholder } from "react-bootstrap";
import personalImg from "../../assets/hero-bg.jpg";
import RateStars from "../RateStars";
import { MdEmail, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { BsHexagon } from "react-icons/bs";
import { FaAddressCard, FaRegUserCircle } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

export default function ClientInfo() {
  const [userData, setUserData] = useState({});
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user.id : null;
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const params = useParams();
  const history = useHistory();
  // console.log(params);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://api-generator.retool.com/D8TEH0/data/${params.user_id}`)
      .then((res) => {
        setUserData(res.data);
        console.log(res.data);
        // console.log(params.user_id);

        if (Object.keys(res.data).length) {
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
          history.push("/Freelancia-Front-End/404");
        }
      })
      .catch((err) => {
        console.log(err);
        history.push("/Freelancia-Front-End/404");
        setIsEmpty(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [history, params]);
  return (
    <>
      <Row className="justify-content-center mt-5">
        <Col md={24}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title className="text-center">User Information</Card.Title>
              <hr />
              {isLoading ? (
                <div>
                  <Card className="shadow-lg p-3 mb-5 bg-white rounded"></Card>
                  <Placeholder xs={6} />
                  <Placeholder className="w-75" />
                  <Placeholder style={{ width: "25%" }} />
                </div>
              ) : (
                <div>
                  <div className="d-flex flex-wrap flex-column align-items-center mb-4">
                    <img
                      className="rounded-circle mb-2 mx-3"
                      width={"128px"}
                      height={"128px"}
                      src={personalImg}
                    />
                    <Card.Title className="text-center h3">
                      {userData.firstName + " " + userData.lastName}
                    </Card.Title>
                    <div>
                      <RateStars rating={3} />
                    </div>
                  </div>
                  <p>
                    <strong className="me-2">
                      <MdEmail color="blue" size="2rem" /> :
                    </strong>
                    {userData.email}.
                  </p>
                  <p>
                    <strong className="me-2">
                      <FaRegUserCircle color="blue" size="2rem" />:{" "}
                    </strong>
                    {userData.username}.
                  </p>
                  <p>
                    <strong className="me-2">
                      <SlCalender color="blue" size="2rem" />:{" "}
                    </strong>
                    {userData.birthdate}.
                  </p>
                  <p>
                    <strong className="me-2">
                      <FaAddressCard color="blue" size="2rem" />:
                    </strong>
                    {userData.address + ", " + userData.postalCode}.
                  </p>
                  <p className="w-50">
                    <strong className="me-2">
                      <MdOutlineDriveFileRenameOutline
                        color="blue"
                        size="2rem"
                      />{" "}
                      Description:
                    </strong>
                    {userData.description}
                  </p>
                  <p>
                    <strong className="me-2">
                      <BsHexagon color="blue" size="2rem" /> Role:
                    </strong>
                    {userData.role}.
                  </p>
                </div>
              )}
            </Card.Body>
            <Link to={`/Freelancia-Front-End/Dashboard/edit/${userData.id}`}>
              Edit Information
            </Link>
          </Card>
        </Col>
      </Row>
    </>
  );
}
