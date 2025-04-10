import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Placeholder } from "react-bootstrap";
import personalImg from "../../assets/default-user.png";
import RateStars from "../RateStars";
import { MdEmail, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { BsHexagon } from "react-icons/bs";
import {
  FaAddressCard,
  FaMoneyBillWave,
  FaRegUserCircle,
} from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import {
  AxiosChatInstance,
  AxiosUserInstance,
} from "../../network/API/AxiosInstance";
import { Button } from "react-bootstrap";
import { BASE_PATH } from "../../network/API/AxiosInstance";
import { FaExclamationTriangle } from "react-icons/fa";
import ReportUserModal from "../Admin-Panel/ReportUserModal";
import { FaUserSlash, FaUserCheck } from "react-icons/fa";
import BanUserModal from "../Admin-Panel/BanUserModal";
import { useTranslation } from 'react-i18next';

export default function ClientInfo(props) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({});
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const user_id = auth ? (auth.user ? auth.user.user_id : null) : null;
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const params = useParams();
  const navigate = useNavigate(); // Replaces useHistory
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const isAdmin = user?.role === "admin";

  // Chat Variable By A.A
  const token = user ? user.access : null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    AxiosUserInstance.get(`${params.user_id}`)
      .then((res) => {
        setUserData(res.data);

        if (Object.keys(res.data).length) {
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
          navigate("/Freelancia-Front-End/404"); // Updated to use navigate
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/Freelancia-Front-End/404"); // Updated to use navigate
        setIsEmpty(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate, params, props.refreshFlag]);

  const handleSendMessage = () => {
    if (!token || !userData || !user) return;

    let users_names = [user.username, userData.username];
    users_names.sort();
    let chat_room_name = users_names.join("-");

    let data = {
      name: chat_room_name,
      participants: [user.user_id, userData.id],
    };

    setLoading(true);

    AxiosChatInstance.post("userchatrooms/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("Created:", res.data);
        navigate(`${BASE_PATH}/chatrooms/?chat_room=${chat_room_name}`);
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err.message);
        setError("Failed to create chat room");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Row className="justify-content-center mt-5">
        <Col md={24}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title className="text-center">{t('profile.userInfo')}</Card.Title>
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
                  <div className="d-flex justify-content-end w-100">
                    {token &&
                      userData &&
                      user &&
                      user.user_id !== userData.id && (
                        <div className="text-end">
                          <Button
                            variant="danger"
                            onClick={() => setShowReportModal(true)}
                          >
                            <FaExclamationTriangle /> {t('profile.reportUser')}
                          </Button>
                        </div>
                      )}
                    {token &&
                      userData &&
                      user &&
                      user.user_id !== userData.id &&
                      isAdmin && (
                        <div className="text-start">
                          <Button
                            variant={userData.is_active ? "danger" : "success"}
                            onClick={() => setShowBanModal(true)}
                            className="ms-2"
                          >
                            {userData.is_active ? (
                              <>
                                <FaUserSlash /> {t('profile.banUser')}
                              </>
                            ) : (
                              <>
                                <FaUserCheck /> {t('profile.unbanUser')}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                  </div>
                  <div className="d-flex flex-wrap flex-column align-items-center mb-4">
                    <img
                      className="rounded-circle mb-2 mx-3"
                      width={"128px"}
                      height={"128px"}
                      src={userData.image ? userData.image : personalImg}
                      alt="user"
                    />
                    <Card.Title className="text-center h3">
                      {userData.name}
                    </Card.Title>
                    <div>
                      <RateStars rating={userData ? userData.rate : 0} />
                    </div>
                    {token && userData && user && (
                      <div className="m-2">
                        <Button
                          variant="primary"
                          onClick={() => handleSendMessage()}
                        >
                          {t('profile.messageBtn')}
                        </Button>
                      </div>
                    )}
                  </div>
                  <p>
                    <strong className="me-2">
                      <MdEmail color="blue" size="2rem" /> {t('profile.email')}:
                    </strong>
                    {userData.email}.
                  </p>
                  <p>
                    <strong className="me-2">
                      <FaRegUserCircle color="blue" size="2rem" /> {t('profile.username')}:
                    </strong>
                    {userData.username}.
                  </p>
                  {userData.id == user_id && (
                    <p>
                      <strong className="me-2">
                        <FaMoneyBillWave color="blue" size="2rem" /> {t('profile.balance')}:
                      </strong>
                      {userData.user_balance}$.
                    </p>
                  )}
                  <p>
                    <strong className="me-2">
                      <SlCalender color="blue" size="2rem" /> {t('profile.birthDate')}:
                    </strong>
                    {userData.birth_date}.
                  </p>
                  <p>
                    <strong className="me-2">
                      <FaAddressCard color="blue" size="2rem" /> {t('profile.address')}:
                    </strong>
                    {userData.address + ", " + userData.postal_code}.
                  </p>
                  {userData.description && (
                    <p>
                      <strong className="me-2">
                        <MdOutlineDriveFileRenameOutline
                          color="blue"
                          size="2rem"
                        />{" "}
                        {t('profile.description')}:
                      </strong>
                      {userData.description}.
                    </p>
                  )}
                  <p>
                    <strong className="me-2">
                      <BsHexagon color="blue" size="2rem" /> {t('profile.role')}:
                    </strong>
                    {userData.role}.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ReportUserModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        userData={userData}
        onSuccess={() => {
          console.log("Report submitted successfully");
        }}
      />
      <BanUserModal
        show={showBanModal}
        onHide={() => setShowBanModal(false)}
        userData={userData}
        isBanned={!userData.is_active}
        onSuccess={() => {
          AxiosUserInstance.get(`${params.user_id}`)
            .then((res) => {
              setUserData(res.data);
            })
            .catch((err) => {
              console.log("Error refreshing user data:", err);
            });
        }}
      />
    </>
  );
}
