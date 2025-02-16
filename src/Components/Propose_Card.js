import {
  Accordion,
  AccordionHeader,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useState } from "react";
import Propose_Msg from "./Propose_Msg";
import { getFromLocalStorage } from "../network/local/LocalStorage";

function Propose_Card(props) {
  const [isUpdate, setIsUpdae] = useState(false);
  const auth = getFromLocalStorage("auth");
  const user = auth.user;
  const isAuth = auth.isAuthenticated;
  const handlecb = (value = false) => {
    setIsUpdae(value);
  };
  return (
    <>
      {auth && isAuth && user.role == "freelancer" && (
        <div>
          <Accordion>
            <Accordion.Item eventKey="0">
              <AccordionHeader>Handle your Proposal</AccordionHeader>
              <Accordion.Body>
                <Card>
                  <Card.Body>
                    {isUpdate ? (
                      <h5 className="card-title">Update Your Proposal</h5>
                    ) : (
                      <h5 className="card-title">Create A New Proposal</h5>
                    )}
                    <div>
                      <Propose_Msg
                        user={props.user}
                        project_id={props.project_id}
                        disabled={props.disabled}
                        cb={handlecb}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      )}
    </>
  );
}

export default Propose_Card;
