import { Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

function Propose_Msg(props) {
  const [itemInfo, setItemInfo] = useState({
    msg: "",
    price: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({
    errText: null,
    priceErr: null,
    deadlineErr: null,
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemInfo.msg.trim() === "") {
      setErrors({
        ...errors,
        errText: "Message cannot be empty",
      });
    } else if (itemInfo.price === "") {
      setErrors({
        ...errors,
        priceErr: "Price cannot be empty",
      });
    } else if (itemInfo.deadline === "") {
      setErrors({
        ...errors,
        deadlineErr: "Deadline cannot be empty",
      });
    } else {
      // Push the data to the database
      axios
        .post("https://api-generator.retool.com/CDcXqj/data", {
          message: itemInfo.msg,
          price_value: itemInfo.price,
          deadline_date: itemInfo.deadline,
          // These Will be changed
          project_id: props.project_id,
          user_id: props.user.id,
          user_name: props.user.name,
          user_rate: 3,
          user_img: "https://logo.clearbit.com/sohu.com",
        })
        .then((response) => {
          // Handle success response
          console.log("Form data successfully sent:", response.data);
          // Call your callback function after success (you can pass the data back if needed)
          props.callback(itemInfo.msg, itemInfo.price, itemInfo.deadline);
        })
        .catch((error) => {
          // Handle error response
          console.error("Error sending form data:", error);
        });
    }
  };

  // Handle input change and validation
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    console.log(e.target);
    setItemInfo({ ...itemInfo, [name]: value });
    if (name === "msg") {
      if (value.trim() == "") {
        setErrors({
          ...errors,
          errText: "Message cannot be empty",
        });
      } else {
        setErrors({
          ...errors,
          errText: "",
        });
      }
    } else if (name === "price") {
      if (value == "") {
        setErrors({
          ...errors,
          priceErr: "Price cannot be empty",
        });
      } else {
        setErrors({
          ...errors,
          priceErr: "",
        });
      }
    } else if (name === "deadline") {
      if (value == "") {
        setErrors({
          ...errors,
          deadlineErr: "Deadline cannot be empty",
        });
      } else {
        setErrors({
          ...errors,
          deadlineErr: "",
        });
      }
    } else {
    }
  };

  return (
    <div className="card p-3 shadow-lg">
      <Form>
        <div className="mb-3">
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Propose Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter an Attractive Message"
              value={itemInfo.msg}
              onChange={handleChange}
              name="msg"
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
            <Form.Label>Deadline</Form.Label>
            <Form.Control
              type="date"
              value={itemInfo.deadline}
              onChange={handleChange}
              name="deadline"
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

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={
            errors.errText ||
            errors.errText == null ||
            errors.priceErr ||
            errors.priceErr == null ||
            errors.deadlineErr ||
            errors.deadlineErr == null
          }
        >
          Propose
        </button>
      </Form>
    </div>
  );
}

export default Propose_Msg;
