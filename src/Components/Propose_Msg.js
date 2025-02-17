import { Alert, Form, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";

function Propose_Msg(props) {
  const auth = getFromLocalStorage("auth");
  const user = auth.user;
  const params = useParams();
  const project_id = params.project_id;
  const history = useHistory();
  // console.log(history);
  // console.log(project_id);
  // console.log("------------------------------");
  const [itemInfo, setItemInfo] = useState({
    propose_text: "",
    price: "",
    deadline: "",
    creation_date: "",
  });
  const [savedItem, setSavedItem] = useState({
    propose_text: "",
    price: "",
    deadline: "",
    creation_date: "",
  });
  const [errors, setErrors] = useState({
    errText: null,
    priceErr: null,
    deadlineErr: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [AlreadyPropsed, setAlreadyProposed] = useState(true);
  const [proposal_id, setProposal_id] = useState(0);

  const [APIError, setAPIError] = useState(null);
  const [APISuccess, setAPISuccess] = useState(null);

  const [showAlert, setShowAlert] = useState(true);
  const handleClose = () => setShowAlert(false);

  const [callingAPI, setCallingAPI] = useState(0);

  // Check if the user Already Made A porposed
  useEffect(() => {
    AxiosProposalsInstance.get(`?user_id=${user.id}&project_id=${project_id}`)
      .then((res) => {
        if (res.data.length > 0) {
          console.log("Already Made A Proposal");
          // console.log(res.data.length);
          // console.log(res.data);
          setAlreadyProposed(true);
          setItemInfo({
            propose_text: res.data[0].propose_text,
            price: res.data[0].price,
            deadline: res.data[0].deadline,
            creation_date: res.data[0].creation_date,
          });
          setSavedItem({
            propose_text: res.data[0].propose_text,
            price: res.data[0].price,
            deadline: res.data[0].deadline,
            creation_date: res.data[0].creation_date,
          });
          console.log("Proposal Saved ID: ", res.data[0].id);
          setProposal_id(res.data[0].id);
          props.cb(true);
        } else {
          setAlreadyProposed(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [callingAPI]);

  const propsal_object = () => {
    const date = new Date();
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setItemInfo({
      ...itemInfo,
      creation_date: date,
    });
    return {
      propose_text: itemInfo.propose_text,
      price: itemInfo.price,
      deadline: itemInfo.deadline,
      project_id: project_id,
      user_id: user.id,
      user_name: user.username,
      user_rate: user.user_rate,
      user_image: "https://logo.clearbit.com/sohu.com",
      creation_date: formattedDate,
    };
  };

  // Save the data into the API
  const saveData = (isUpdate = false) => {
    setIsLoading(true);
    AxiosProposalsInstance.post("", propsal_object())
      .then((response) => {
        // Handle success response
        console.log("Form data successfully sent:", response.data);
        // Call your callback function after success (you can pass the data back if needed)
        if (props.callback) {
          props.callback(
            itemInfo.propose_text,
            itemInfo.price,
            itemInfo.deadline,
            itemInfo.creation_date
          );
        }
        setAPIError(false);
        setAPISuccess(true);
        setShowAlert(true);
        setCallingAPI(callingAPI + 1);
      })
      .catch((error) => {
        // Handle error response
        console.error("Error sending form data:", error);
        setAPIError(true);
        setAPISuccess(false);
        setShowAlert(true);
      })
      .finally(() => {
        console.log("Finsished");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  // Save the data into the API
  const updateData = (isUpdate = true) => {
    setIsLoading(true);
    AxiosProposalsInstance.put(`/${proposal_id}`, propsal_object())
      .then((response) => {
        // Handle success response
        console.log("Form data successfully sent:", response.data);
        // Call your callback function after success (you can pass the data back if needed)
        if (props.callback) {
          props.callback(
            itemInfo.propose_text,
            itemInfo.price,
            itemInfo.deadline
          );
        }
        setAPIError(false);
        setAPISuccess(true);
        setShowAlert(true);
        setCallingAPI(callingAPI + 1);
      })
      .catch((error) => {
        // Handle error response
        console.error("Error sending form data:", error);
        setAPIError(true);
        setAPISuccess(false);
        setShowAlert(true);
      })
      .finally(() => {
        console.log("Finsished");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemInfo.propose_text.trim() === "") {
      setErrors({
        ...errors,
        errText: "Invalid Message Text",
      });
    } else if (itemInfo.price === "") {
      setErrors({
        ...errors,
        priceErr: "Invalid Price",
      });
    } else if (itemInfo.deadline === "") {
      setErrors({
        ...errors,
        deadlineErr: "Invalid Deadline",
      });
    } else {
      // console.log(user);
      setIsLoading(true);
      // Push the data to the database
      saveData(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Update the item info
    setIsLoading(true);
    // console.log("In Handle Update");
    // console.log("itemInfo", itemInfo);
    // console.log("savedItem", savedItem);
    if (
      itemInfo.deadline !== savedItem.deadline ||
      itemInfo.price !== savedItem.price ||
      itemInfo.propose_text !== savedItem.propose_text
    ) {
      // console.log("Updating");
      updateData(true);
    } else {
      // console.log("Not Updating");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      setAPIError(true);
    }
  };

  // Handle input change and validation
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const textReg = /^[a-zA-Z0-9\s\.\_\*]+$/;
    const priceReg = /^[0-9]*\.?[0-9]{0,2}$/;
    const deadlineReg = /^\d{1,}$/;

    // console.log(e.target);

    let check = true;
    if (name === "propose_text") {
      check = textReg.test(value);
    } else if (name === "price") {
      check = priceReg.test(value);
    } else if (name === "deadline") {
      check = deadlineReg.test(value);
    }

    // console.log("Check", check);

    if (check || value === "") {
      setItemInfo({ ...itemInfo, [name]: value });
    }

    if (name === "propose_text") {
      if (value.trim() === "" || value.length < 5 || !check) {
        setErrors({
          ...errors,
          errText: "Invalid Message text",
        });
      } else {
        setErrors({
          ...errors,
          errText: "",
        });
      }
    } else if (name === "price") {
      if (value === "" || !check) {
        setErrors({
          ...errors,
          priceErr: "Invalid Price",
        });
      } else {
        setErrors({
          ...errors,
          priceErr: "",
        });
      }
    } else if (name === "deadline") {
      if (value === "" || !check) {
        setErrors({
          ...errors,
          deadlineErr: "Invalid Deadline",
        });
      } else {
        setErrors({
          ...errors,
          deadlineErr: "",
        });
      }
    } else {
      // Ending Handling all the cases
    }
  };

  return (
    <div className="card p-3 shadow-lg">
      <Alert
        id="alert"
        name="alert"
        variant={APISuccess ? "success" : APIError ? "danger" : ""}
        show={showAlert && (APISuccess || APIError)}
        onClose={handleClose}
        dismissible
      >
        {APISuccess && "Saved successfully!"}
        {APIError && "Failed to Save!"}
      </Alert>

      <Form>
        <div className="mb-3">
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Propose Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter an Attractive Message"
              value={itemInfo.propose_text}
              onChange={handleChange}
              name="propose_text"
              isInvalid={errors.errText !== "" && errors.errText !== null}
              disabled={props.disabled}
            />
            <Form.Control.Feedback type="invalid">
              {errors.errText}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="mb-3">
          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Price"
              value={itemInfo.price}
              onChange={handleChange}
              name="price"
              isInvalid={errors.priceErr !== "" && errors.priceErr !== null}
              disabled={props.disabled}
            />
            <Form.Control.Feedback type="invalid">
              {errors.priceErr}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="mb-3">
          <Form.Group className="mb-3" controlId="formDeadline">
            <Form.Label>Deadline In Days</Form.Label>
            <Form.Control
              type="number"
              value={itemInfo.deadline}
              onChange={handleChange}
              name="deadline"
              placeholder="Enter Estimated Deadline in Days"
              isInvalid={
                errors.deadlineErr !== "" && errors.deadlineErr !== null
              }
              disabled={props.disabled}
            />
            <Form.Control.Feedback type="invalid">
              {errors.deadlineErr}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="d-flex justify-content-center">
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <button
              type="submit"
              className="btn btn-primary w-50"
              onClick={
                AlreadyPropsed
                  ? isLoading
                    ? null
                    : handleUpdate
                  : isLoading
                  ? null
                  : handleSubmit
              }
              disabled={
                errors.errText ||
                itemInfo.propose_text === "" ||
                errors.priceErr ||
                itemInfo.price === "" ||
                errors.deadlineErr ||
                itemInfo.deadline === "" ||
                isLoading ||
                (itemInfo.propose_text === savedItem.propose_text &&
                  itemInfo.price === savedItem.price &&
                  itemInfo.deadline === savedItem.deadline)
              }
            >
              {AlreadyPropsed
                ? isLoading
                  ? "Loading…"
                  : "Update"
                : isLoading
                ? "Loading…"
                : "Propose"}
            </button>
          )}
        </div>
      </Form>
    </div>
  );
}

export default Propose_Msg;
