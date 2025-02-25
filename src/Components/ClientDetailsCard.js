import axios from "axios";
import { Card, Placeholder } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import { Image } from "react-bootstrap";
import RateStars from "./RateStars";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function ClientDetailsCard(props) {
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    rate: "",
    image: null,
  });
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    // let id = Math.floor(Math.random() * 50) + 1;
    if (props.project.owner_id) {
      setUserLoading(true);
      console.log("Client ID:" , props.project.owner_id)
      axios
        .get(
          `https://api-generator.retool.com/Esur5x/dummyUsers/${props.project.owner_id}`
        )
        .then((res) => {
          setClientDetails(res.data);
        })
        .catch((err) => {
          console.log(err);
          axios.get(`https://api-generator.retool.com/D8TEH0/data/${props.project.owner_id}`)
          .then((res) => {
            setClientDetails(res.data);
          }).catch((err) => {
            console.log(err);
          })
        })
        .finally(() => {
          setUserLoading(false);
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
              {clientDetails.image || !props.isLoading || !userLoading ? (
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
                <div>
                  {props.isLoading || userLoading ? (
                    <>
                      <Placeholder xs={6} size="lg" />
                    </>
                  ) : (
                    <>{clientDetails.name}</>
                  )}
                </div>
                <div className="text-muted">
                  <RateStars rating={clientDetails.rate} />
                </div>
              </div>
            </div>
          </Card.Title>
          <Card.Text>
            <IoLocationSharp />

            {props.isLoading || userLoading ? (
              <>
                <Placeholder xs={6} />
              </>
            ) : (
              <>{clientDetails.address}</>
            )}
          </Card.Text>
          <Card.Text>
            <FaPhoneAlt />
            {props.isLoading || userLoading ? (
              <>
                <Placeholder xs={6} />
              </>
            ) : (
              <>{clientDetails.phone}</>
            )}
          </Card.Text>
          <Card.Text>
            <MdEmail />
            {props.isLoading || userLoading ? (
              <>
                <Placeholder xs={6} />
              </>
            ) : (
              <>{clientDetails.email}</>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default ClientDetailsCard;
