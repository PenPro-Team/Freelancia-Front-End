import axios from "axios";
import {
  Card,
  Image,
  Spinner,
  Alert,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import RateStars from "./RateStars";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { AxiosReviewInstance } from "../network/API/AxiosInstance";
import defaultUserImage from "../assets/default-user.png";
function ClientHistory({ owner_id: owner ,project_id }) {
  const [clientReviews, setClientReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState({});
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [userFeedback, setUserFeedback] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);
  const [editError, setEditError] = useState(null);

  const currentUser = getFromLocalStorage("auth");


  useEffect(() => {
    if (!owner) return;
    AxiosReviewInstance
      .get(
        `received/user/${owner.id}`
      )
      .then((res) => {
        console.log(res.data);
        setClientReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [owner]);

  useEffect(() => {
    if (!currentUser) return;
    const existingFeedback = clientReviews.find(
      (review) => review.user_reviewr_details.id == currentUser?.user?.user_id
    );
    setUserFeedback(existingFeedback);
  }, [currentUser, clientReviews]);

  const makeFeedback = () => {


    if (!feedback.trim() || userFeedback || !currentUser?.user?.user_id) return;
     

    AxiosReviewInstance
      .post(`create`,  {
        "user_reviewr": currentUser.user.user_id,
        "user_reviewed": owner.id,
        "rate": rating,
        "message": feedback,
        "project":project_id
      },)
      .then((res) => {
        setClientReviews([res.data, ...clientReviews]);
        setUserFeedback(res.data);
        setFeedback("");
        setRating(5);
      })
      .catch(console.error);
  };

  const openEditModal = (review) => {
    setEditingReview({ ...review });
    setShowEditModal(true);
  };

  const updateFeedback = () => {
    console.log("editingReview");
    console.log(editingReview);
    console.log( currentUser.user.access);
    AxiosReviewInstance.patch(
      `update/${editingReview.id}`,
      {
        message: editingReview.message,
        rate: editingReview.rate,
      },
      {
        headers: {
          Authorization: `Bearer ${currentUser.user.access}`, 
        },
      }
    )
      .then((res) => {
        setClientReviews(
          clientReviews.map((review) =>
            review.id === res.data.id ? res.data : review
          )
        );
        setUserFeedback(res.data);
        setShowEditModal(false);
      })
      .catch(console.error);
  };

  const openDeleteModal = (review) => {
    setDeletingReview(review);
    setShowDeleteModal(true);
  };

  const deleteFeedback = () => {
    AxiosReviewInstance
      .delete(
        `delete/${deletingReview.id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.user.access}`, // Or without Bearer if your backend doesn't require it
          },
        }
      )
      .then(() => {
        setClientReviews(
          clientReviews.filter((review) => review.id !== deletingReview.id)
        );
        setUserFeedback(null);
        setShowDeleteModal(false);
      })
      .catch(console.error);
  };

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : clientReviews.length === 0 ? (
        <Alert variant="info">No reviews available.</Alert>
      ) : (
        clientReviews.map((review) => (
          <Card key={review.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                <div className="d-flex align-items-center">
                  <Image
                    src={review.user_reviewr_details.image ? review.user_reviewr_details.image : defaultUserImage}
                    roundedCircle
                    width={50}
                    height={50}
                    className="me-2"
                  />
                  <div>
                    <div>{review.user_reviewr_details.first_name || "Anonymous"}</div>
                    <RateStars rating={review.rate} />
                  </div>
                </div>
              </Card.Title>
              <div className="fw-bold">Review Message:</div>
              <div>{review.message}</div>
              {review.created_at && (
          <div>
            <span
              className="text-secondary small fw-bold"
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
              }}
            >
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(new Date(review.created_at))}
            </span>
          </div>
        )}
              {currentUser?.user?.user_id === review.user_reviewr_details.id && (
                <div className="mt-2 d-flex">
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => openEditModal(review)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openDeleteModal(review)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      {currentUser.user != null &&
        !userFeedback &&
        currentUser.user.role === "freelancer" && (
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Leave a Review</Card.Title>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Write your review here"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="mt-2 d-flex">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`me-2 cursor-pointer ${
                      num <= rating ? "text-warning" : "text-secondary"
                    }`}
                    onClick={() => setRating(num)}
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <Button
                className="mt-2"
                variant="primary"
                onClick={makeFeedback}
                disabled={!feedback.trim()}
              >
                Submit
              </Button>
            </Card.Body>
          </Card>
        )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger">{editError}</Alert>}
          <Form.Control
            as="textarea"
            rows="3"
            value={editingReview?.message || ""}
            onChange={(e) =>
              setEditingReview({ ...editingReview, message: e.target.value })
            }
          />

          <div className="mt-2 d-flex">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`me-2 ${
                  num <= editingReview?.rate ? "text-warning" : "text-secondary"
                }`}
                onClick={() =>
                  setEditingReview({ ...editingReview, rate: num })
                }
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
              >
                ★
              </span>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={updateFeedback}
            disabled={
              !editingReview?.message.trim() ||
              (editingReview?.message === userFeedback?.message &&
                editingReview?.rate === userFeedback?.rate)
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this review? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteFeedback}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ClientHistory;
