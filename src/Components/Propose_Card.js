import {
  Accordion,
  AccordionHeader,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useState } from "react";
import Propose_Msg from "./Propose_Msg";

function Propose_Card(props) {

  return (
    <div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <AccordionHeader>Make a Proposal</AccordionHeader>
          <Accordion.Body>
            <Card>
              <Card.Body>
                <h5 className="card-title">Proposal Title</h5>
                <div>
                  <Propose_Msg
                    user = {props.user}
                    project_id={props.project_id}
                    disabled={props.disabled}
                  />
                </div>
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Propose_Card;
