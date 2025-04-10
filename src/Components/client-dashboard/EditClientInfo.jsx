import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  Container,
  Row,
  Col,
  Placeholder,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { AxiosUserInstance } from "../../network/API/AxiosInstance";
import defaultImage from "../../assets/default-user.png";
import { setToLocalStorage } from "../../network/local/LocalStorage";
import { useTranslation } from 'react-i18next';

export default function EditClientInfo(props) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({});
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(true);

  const [formValues, setFormValues] = useState({
    first_name: "",

    last_name: "",

    birth_date: "",

    postal_code: "",

    address: "",

    description: "",
    // image: ""
  });
  console.log(formValues.first_name);

  const [isFormValid, setIsFormValid] = useState(false);
  const userRegex = /^[a-zA-Z]+$/;
  // console.log(params);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    setFormValues({ ...formValues, [name]: newValue });

    let errorMessage = "";

    console.log(name);

    if (newValue.trim() === "") {
      errorMessage = t('formValidation.required');
    } else {
      switch (name) {
        case "firstName":
        case "lastName":
          if (!userRegex.test(newValue)) {
            errorMessage = t('formValidation.lettersOnly');
          }
          break;

        case "birthdate":
          const selectedDate = new Date(newValue);
          const currentDate = new Date();
          const ageDifMs = currentDate - selectedDate;
          const ageDate = new Date(ageDifMs);
          const age = ageDate.getUTCFullYear() - 1970;
          if (age < 18) {
            errorMessage = t('formValidation.age18');
          }
          break;

        case "postalCode":
          if (!/^\d+$/.test(newValue)) {
            errorMessage = t('formValidation.numbersOnly');
          }
          break;

        case "address":
          if (newValue.trim().length < 5) {
            errorMessage = t('formValidation.minLength5');
          }
          break;
        case "description":
          if (newValue.length < 200) {
            errorMessage = t('formValidation.minLength200');
          }
          break;
        default:
          break;
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, [name]: errorMessage };
      const allValid = Object.values(updatedErrors).every(
        (error) => error === ""
      );
      setIsFormValid(allValid);
      return updatedErrors;
    });
  };

  useEffect(() => {
    setIsLoading(true);

    AxiosUserInstance.get(`${params.user_id}`)

      .then((res) => {
        setUserData(res.data);

        setFormValues(res.data);

        console.log(res.data);

        // console.log(params.user_id);

        if (Object.keys(res.data).length) {
          setIsEmpty(false);
        } else {
          setIsEmpty(true);

          navigate("/Freelancia-Front-End/404");
        }
      })

      .catch((err) => {
        console.log(err);

        navigate("/Freelancia-Front-End/404");

        setIsEmpty(true);
      })

      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate, params.user_id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowSuccess(false);

    setShowError(false);

    setShow(true);

    console.log(formValues.image);

    if (isFormValid) {
      AxiosUserInstance.patch(`${params.user_id}`, formValues, {
        headers: { Authorization: `Bearer ${user.access}` },
      })

        .then((res) => {
          console.log(res.data);

          setShowSuccess(true);

          setShowError(false);

          setUserData(formValues);

          setShow(true);

          props.cb();
        })
        .catch((error) => {
          console.log(error);

          setShowSuccess(false);

          setShowError(true);
        });
    }
  };
  const handleDeleteImage = (e) => {
    e.preventDefault();
    AxiosUserInstance.patch(
      `${params.user_id}`,
      { image: null },
      { headers: { Authorization: `Bearer ${user.access}` } }
    )
      .then((res) => {
        setUserData({ ...userData, image: null });

        console.log(res.data.image);

        // console.log("form value" + formValues.image);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUploadImage = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const upload_file = e.target.files[0];
    console.log(upload_file);
    const formData = new FormData();
    formData.append("image", upload_file);
    AxiosUserInstance.patch(`${params.user_id}`, formData, {
      headers: {
        Authorization: `Bearer ${user.access}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log("image upload function" + res.data.image);
        setUserData({ ...userData, image: res.data.image });
        setToLocalStorage("auth", {
          ...auth,
          user: { ...auth.user, image: res.data.image },
        });
        // console.log("form value" + formValues.image);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const uploadBtn = () => {
    document.getElementById("image").click();
  }
  return (
    <>
      <Row className="justify-content-center mt-5">
        <Col md={24}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title className="text-center">{t('profile.userInfo')}</Card.Title>

              {isLoading ? (
                <div>
                  <Card className="shadow-lg p-3 mb-5 bg-white rounded"></Card>

                  <Placeholder xs={6} />

                  <Placeholder className="w-75" />

                  <Placeholder style={{ width: "25%" }} />
                </div>
              ) : (
                <>
                  <Form onSubmit={handleSubmit}></Form>

                  {showSuccess ? (
                    <Alert
                      variant="success"
                      onClose={() => setShow(false)}
                      dismissible
                    >
                      {t('profile.updateSuccess')}
                    </Alert>
                  ) : (
                    ""
                  )}

                  {showError ? (
                    <Alert
                      variant="danger"
                      dismissible
                      onClose={() => setShow(false)}
                    >
                      {t('alerts.updateError')}
                    </Alert>
                  ) : null}

                  <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Row className="mb-3 ">
                      <Form.Group
                        controlId="formFile"
                        className="mb-3"
                        name="profilePicture"
                      >
                        {userData.image ? (
                          <>
                            <div className="d-flex flex-wrap mb-4 justify-content-center">
                              <img
                                className="rounded-circle mb-2 mx-3"
                                width={"128px"}
                                height={"128px"}
                                src={userData.image}
                              />

                              <div className="w-100 mx-3 d-flex justify-content-center">
                                <Button
                                  variant="outline-danger mx-2"
                                  onClick={(e) => handleDeleteImage(e)}
                                >
                                  {t('profile.deleteImage')}
                                </Button>

                                <Button
                                  variant="outline-info"
                                  onClick={() =>
                                    uploadBtn()
                                  }
                                >
                                  {t('profile.editImage')}
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="d-flex flex-wrap mb-4 justify-content-center">
                            <img
                              className="rounded-circle mb-2 mx-3"
                              width={"128px"}
                              height={"128px"}
                              src={defaultImage}
                            />

                            <div className="w-100 mx-3 d-flex justify-content-center">
                              <Button variant="outline-success"
                                onClick={() =>
                                  uploadBtn()
                                }>
                                {t('profile.uploadImage')}
                              </Button>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          name="image"
                          id="image"
                          hidden
                          // value={formValues.image}

                          onChange={(e) => handleUploadImage(e)}
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>{t('profile.firstName')}</Form.Label>

                        <Form.Control
                          name="first_name"
                          type="text"
                          placeholder={t('placeholders.firstName')}
                          value={formValues.first_name}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.first_name)}
                          feedback={errors.firstName}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>{t('profile.lastName')}</Form.Label>

                        <Form.Control
                          name="last_name"
                          type="text"
                          placeholder={t('placeholders.lastName')}
                          value={formValues.last_name}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.last_name)}
                          feedback={errors.lastName}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                      <Form.Label>{t('profile.address')}</Form.Label>

                      <Form.Control
                        name="address"
                        placeholder={t('placeholders.address')}
                        value={formValues.address}
                        onChange={handleChange}
                        isInvalid={Boolean(errors.address)}
                        feedback={errors.address}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                      <Form.Label>{t('profile.postalCode')}</Form.Label>

                      <Form.Control
                        name="postal_code"
                        placeholder={t('placeholders.postalCode')}
                        value={formValues.postal_code}
                        onChange={handleChange}
                        isInvalid={Boolean(errors.postal_code)}
                        feedback={errors.postal_code}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.postalCode}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>{t('profile.birthDate')}</Form.Label>

                        <Form.Control
                          name="birth_date"
                          type="date"
                          value={formValues.birth_date}
                          onChange={handleChange}
                          isInvalid={Boolean(errors.birthdate)}
                          feedback={errors.birthdate}
                          min="1980-01-01"
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.birthdate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>{t('profile.description')}</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        isInvalid={Boolean(errors.description)}
                        feedback={errors.description}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={
                        !isFormValid ||
                        (userData.firstName == formValues.first_name &&
                          userData.lastName == formValues.last_name &&
                          userData.address == formValues.address &&
                          userData.postalCode == formValues.postal_code &&
                          userData.birthdate == formValues.birth_date &&
                          userData.description == formValues.description &&
                          !formValues.image)
                      }
                    >
                      {t('profile.submit')}
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
