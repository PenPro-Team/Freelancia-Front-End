import axios from "axios";
import { Card, Image, Spinner, Modal, Button, Form, Alert } from "react-bootstrap";
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

  const currentUser = getFromLocalStorage("auth");

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editError, setEditError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);

  // Fetch client details
  useEffect(() => {
    if (!owner_id) return;
    axios.get(`https://api-generator.retool.com/Esur5x/dummyUsers/${owner_id}`)
      .then(res => setClientDetails(res.data))
      .catch(console.error);
  }, [owner_id]);

  // Fetch reviews
  useEffect(() => {
    if (!owner_id) return;

    axios.get(`https://api-generator.retool.com/ECRLlk/feedback?user_reviewed=${owner_id}`)
      .then(res => {
        setClientReviews(res.data);

        // Check if the current user has already submitted feedback
        const existingFeedback = res.data.find(review => review.user_reviewr === currentUser?.user?.id);
        setUserFeedback(existingFeedback);

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [owner_id, currentUser]);

  // Submit feedback
  const makeFeedback = () => {
    if (!feedback.trim() || userFeedback) return;

    axios.post("https://api-generator.retool.com/ECRLlk/feedback", {
      user_reviewr: currentUser.user.id,
      user_reviewed: owner_id,
      rate: rating,
      message: feedback,
      img: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
    }).then(res => {
      setClientReviews([res.data, ...clientReviews]);
      setUserFeedback(res.data);
      setFeedback("");
      setRating(5);
    }).catch(console.error);
  };

  // Open edit modal
  const openEditModal = (review) => {
    setEditingReview({ ...review });
    setEditError("");
    setShowEditModal(true);
  };

  // Update feedback
  const updateFeedback = () => {
    if (!editingReview.message.trim()) {
      setEditError("Feedback message cannot be empty.");
      return;
    }

    axios.patch(`https://api-generator.retool.com/ECRLlk/feedback/${editingReview.id}`, {
      message: editingReview.message,
      rate: editingReview.rate,
    }).then(res => {
      setClientReviews(clientReviews.map(review => review.id === res.data.id ? res.data : review));
      setUserFeedback(res.data);
      setShowEditModal(false);
    }).catch(console.error);
  };

  // Open delete modal
  const openDeleteModal = (review) => {
    setDeletingReview(review);
    setShowDeleteModal(true);
  };

  // Delete feedback
  const deleteFeedback = () => {
    axios.delete(`https://api-generator.retool.com/ECRLlk/feedback/${deletingReview.id}`)
      .then(() => {
        setClientReviews(clientReviews.filter(review => review.id !== deletingReview.id));
        setUserFeedback(null);
        setShowDeleteModal(false);
      })
      .catch(console.error);
  };

  return (
    <>
      <div>
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
                    <Image src={review.img} roundedCircle width={50} height={50} className="me-2" />
                    <div>
                      <div>{clientDetails.name}</div>
                      <RateStars rating={review.rate} />
                    </div>
                  </div>
                </Card.Title>
                <div className="fw-bold">Review Message:</div>
                <div>{review.message}</div>

                {/* Show actions only for the current user's feedback */}
                {currentUser?.user?.id === review.user_reviewr && (
                  <div className="mt-2 d-flex">
                    <Button variant="warning" className="me-2" onClick={() => openEditModal(review)}>Update</Button>
                    <Button variant="danger" onClick={() => openDeleteModal(review)}>Delete</Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Feedback Form - Show only if user is logged in and hasn't submitted feedback */}
      {currentUser==null && !userFeedback && (
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
            <Form.Select className="mt-2" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Star{num > 1 && "s"}</option>)}
            </Form.Select>
            <Button className="mt-2" variant="primary" onClick={makeFeedback} disabled={!feedback.trim()}>
              Submit
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger">{editError}</Alert>}
          <Form.Control
            as="textarea"
            rows="3"
            value={editingReview?.message}
            onChange={(e) => setEditingReview({ ...editingReview, message: e.target.value })}
          />
          <Form.Select
            className="mt-2"
            value={editingReview?.rate}
            onChange={(e) => setEditingReview({ ...editingReview, rate: Number(e.target.value) })}
          >
            {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Star{num > 1 && "s"}</option>)}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={updateFeedback}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this feedback?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteFeedback}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ClientHistory;
