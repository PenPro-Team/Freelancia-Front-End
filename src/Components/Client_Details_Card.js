import axios from "axios";
import { Card } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import { Image } from "react-bootstrap";
import Rate_Stars from "./Rate_Stars";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Client_Details_Card(props) {
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    rate: "",
    image: "",
  });

  useEffect(() => {
    // let id = Math.floor(Math.random() * 50) + 1;
    if (props.project.owner_id) {
      axios
        .get(
          `https://api-generator.retool.com/Esur5x/dummyUsers/${props.project.owner_id}`
        )
        .then((res) => {
          setClientDetails(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.project.owner_id]);
  return (
    <>
      <Card>
        <Card.Header>Client Details</Card.Header>
        <Card.Body>
          <Card.Title>
            <div className="d-flex align-items-center">
              {clientDetails.image ? (
                <Image
                  src={clientDetails.image}
                  roundedCircle
                  alt={clientDetails.name}
                  width={50}
                  height={50}
                  className="me-2"
                />
              ) : (
                <div
                  className="me-2"
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#ccc",
                    borderRadius: "50%",
                  }}
                ></div>
              )}
              <div className="d-flex flex-column">
                <div>{clientDetails.name}</div>
                <div className="text-muted">
                  <Rate_Stars rating={clientDetails.rate} />
                </div>
              </div>
            </div>
          </Card.Title>
          <Card.Text>
            <IoLocationSharp /> {clientDetails.address}
          </Card.Text>
          <Card.Text>
            <FaPhoneAlt /> {clientDetails.phone}
          </Card.Text>
          <Card.Text>
            <MdEmail /> {clientDetails.email}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default Client_Details_Card;
