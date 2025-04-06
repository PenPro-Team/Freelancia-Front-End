import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import ProposeMsg from "./ProposeMsg";
import { getFromLocalStorage } from "../network/local/LocalStorage";

function ProposeCard(props) {
  const [isUpdate, setIsUpdae] = useState(false);
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const isAuth = auth.isAuthenticated;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlecb = (value = false) => {
    setIsUpdae(value);
  };
  return (
    <>
      {auth && isAuth && user && user.role === "freelancer" && (
        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleShow}>
            Handle Your Proposal
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {isUpdate ? (
                  <h5 className="card-title">Update Your Proposal</h5>
                ) : (
                  <h5 className="card-title">Create A New Proposal</h5>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <ProposeMsg
                  user={props.user ? props.user : user}
                  project_id={props.project_id}
                  disabled={props.disabled}
                  cb={handlecb}
                  CB_proposals_refresh={props.CB_proposals_refresh}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {/* <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button> */}
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default ProposeCard;
