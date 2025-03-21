import { Alert, Form, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { useParams } from "react-router-dom";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";

function ProposeMsg(props) {
  const auth = getFromLocalStorage("auth");
  const user = auth.user;
  const user_id = user.user_id;
  const params = useParams();
  const project_id = params.project_id;
  const [itemInfo, setItemInfo] = useState({
    propose_text: "",
    price: "",
    deadline: "",
    created_at: "",
  });
  const [savedItem, setSavedItem] = useState({
    propose_text: "",
    price: "",
    deadline: "",
    created_at: "",
  });
  const [errors, setErrors] = useState({
    errText: null,
    priceErr: null,
    deadlineErr: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [AlreadyPropsed, setAlreadyProposed] = useState(true);
  const [proposal_id, setProposal_id] = useState(0);

  const [APIError, setAPIError] = useState(false);
  const [APISuccess, setAPISuccess] = useState(false);

  const [showAlert, setShowAlert] = useState(true);
  const handleClose = () => setShowAlert(false);

  const [callingAPI, setCallingAPI] = useState(0);

  // Check if the user Already Made A porposed
  useEffect(() => {
    AxiosProposalsInstance.get(`?user=${user_id}&project=${project_id}`)
      .then((res) => {
        if (res.data.length > 0) {
          setAlreadyProposed(true);
          setItemInfo({
            propose_text: res.data[0].propose_text,
            price: res.data[0].price,
            deadline: res.data[0].deadline,
            created_at: res.data[0].created_at,
          });
          setSavedItem({
            propose_text: res.data[0].propose_text,
            price: res.data[0].price,
            deadline: res.data[0].deadline,
            created_at: res.data[0].created_at,
          });
          setProposal_id(res.data[0].id);
          props.cb(true);
        } else {
          setAlreadyProposed(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callingAPI, project_id, props, user_id]);

  const propsal_object = () => {
    return {
      propose_text: itemInfo.propose_text,
      price: itemInfo.price,
      deadline: itemInfo.deadline,
      project: project_id,
      user: user_id,
    };
  };

  const saveData = () => {
    setIsLoading(true);
    AxiosProposalsInstance.post("", propsal_object(), {
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
    })
      .then((response) => {
        setAPIError(false);
        setAPISuccess(true);
        setShowAlert(true);
        setCallingAPI(callingAPI + 1);
      })
      .catch((error) => {
        console.error(error);
        setAPIError(true);
        setAPISuccess(false);
        setShowAlert(true);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          props.CB_proposals_refresh();
        }, 1000);
      });
  };

  const updateData = () => {
    setIsLoading(true);
    AxiosProposalsInstance.patch(`/${proposal_id}`, propsal_object(), {
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
    })
      .then((response) => {
        setAPIError(false);
        setAPISuccess(true);
        setShowAlert(true);
        setCallingAPI(callingAPI + 1);
      })
      .catch((error) => {
        console.error(error);
        setAPIError(true);
        setAPISuccess(false);
        setShowAlert(true);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          props.CB_proposals_refresh();
        }, 1000);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemInfo.propose_text.trim() === "") {
      setErrors({ ...errors, errText: "Invalid Message Text" });
    } else if (itemInfo.price === "") {
      setErrors({ ...errors, priceErr: "Invalid Price" });
    } else if (itemInfo.deadline === "") {
      setErrors({ ...errors, deadlineErr: "Invalid Deadline" });
    } else {
      setIsLoading(true);
      saveData();
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      itemInfo.deadline !== savedItem.deadline ||
      itemInfo.price !== savedItem.price ||
      itemInfo.propose_text !== savedItem.propose_text
    ) {
      updateData();
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      setAPIError(true);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const textReg = /^[a-zA-Z0-9\s._*]+$/;
    const priceReg = /^[0-9]*\.?[0-9]{0,2}$/;
    const deadlineReg = /^\d{1,}$/;

    let check = true;
    if (name === "propose_text") {
      check = textReg.test(value);
    } else if (name === "price") {
      check = priceReg.test(value);
    } else if (name === "deadline") {
      check = deadlineReg.test(value);
    }

    if (check || value === "") {
      setItemInfo({ ...itemInfo, [name]: value });
    }

    if (name === "propose_text") {
      setErrors({ ...errors, errText: !check ? "Invalid Message text" : "" });
    } else if (name === "price") {
      setErrors({ ...errors, priceErr: !check ? "Invalid Price" : "" });
    } else if (name === "deadline") {
      setErrors({ ...errors, deadlineErr: !check ? "Invalid Deadline" : "" });
    }
  };

  return (
    <div className="card p-3 shadow-lg">
      <Alert
        variant={APISuccess ? "success" : APIError ? "danger" : ""}
        show={showAlert && (APISuccess || APIError)}
        onClose={handleClose}
        dismissible
      >
        {APISuccess && "Saved successfully!"}
        {APIError && "Failed to Save!"}
      </Alert>

      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Propose Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter an Attractive Message"
            value={itemInfo.propose_text}
            onChange={handleChange}
            name="propose_text"
            isInvalid={errors.errText !== ""}
            disabled={props.disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.errText}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price"
            value={itemInfo.price}
            onChange={handleChange}
            name="price"
            isInvalid={errors.priceErr !== ""}
            disabled={props.disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.priceErr}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDeadline">
          <Form.Label>Deadline In Days</Form.Label>
          <Form.Control
            type="number"
            value={itemInfo.deadline}
            onChange={handleChange}
            name="deadline"
            placeholder="Enter Estimated Deadline in Days"
            isInvalid={errors.deadlineErr !== ""}
            disabled={props.disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.deadlineErr}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-center">
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <button
              type="submit"
              className="btn btn-primary w-50"
              onClick={AlreadyPropsed ? handleUpdate : handleSubmit}
              disabled={
                errors.errText ||
                errors.priceErr ||
                errors.deadlineErr ||
                isLoading
              }
            >
              {AlreadyPropsed ? "Update" : "Propose"}
            </button>
          )}
        </div>
      </Form>
    </div>
  );
}

export default ProposeMsg;
