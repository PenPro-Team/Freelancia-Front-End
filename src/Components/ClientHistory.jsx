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

function ClientHistory({ owner_id }) {
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
    if (!owner_id) return;
    axios
      .get(`https://api-generator.retool.com/Esur5x/dummyUsers/${owner_id}`)
      .then((res) => setClientDetails(res.data))
      .catch(console.error);
  }, [owner_id]);

  useEffect(() => {
    if (!owner_id) return;
    axios
      .get(
        `https://api-generator.retool.com/ECRLlk/feedback?user_reviewed=${owner_id}`
      )
      .then((res) => {
        setClientReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [owner_id]);

  useEffect(() => {
    if (!currentUser) return;
    const existingFeedback = clientReviews.find(
      (review) => review.user_reviewr === currentUser?.user?.id
    );
    setUserFeedback(existingFeedback);
  }, [currentUser, clientReviews]);

  const makeFeedback = () => {
    if (!feedback.trim() || userFeedback || !currentUser?.user?.id) return;

    axios
      .post("https://api-generator.retool.com/ECRLlk/feedback", {
        user_reviewr: currentUser.user.id,
        user_reviewed: owner_id,
        rate: rating,
        message: feedback,
        img: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
      })
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
    axios
      .patch(
        `https://api-generator.retool.com/ECRLlk/feedback/${editingReview.id}`,
        {
          message: editingReview.message,
          rate: editingReview.rate,
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
    axios
      .delete(
        `https://api-generator.retool.com/ECRLlk/feedback/${deletingReview.id}`
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
                    src={review.img}
                    roundedCircle
                    width={50}
                    height={50}
                    className="me-2"
                  />
                  <div>
                    <div>{clientDetails.name || "Anonymous"}</div>
                    <RateStars rating={review.rate} />
                  </div>
                </div>
              </Card.Title>
              <div className="fw-bold">Review Message:</div>
              <div>{review.message}</div>
              {currentUser?.user?.id === review.user_reviewr && (
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

      {currentUser?.user != null &&
        !userFeedback &&
        currentUser?.user?.role === "freelancer" && (
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
