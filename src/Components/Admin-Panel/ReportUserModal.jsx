import { Modal, Form, Button } from "react-bootstrap";
import { AxiosReportInstance } from "../../network/API/AxiosInstance";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { getFromLocalStorage } from "../../network/local/LocalStorage";

function ReportUserModal({ show, onHide, userData, onSuccess }) {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;

  const [reportData, setReportData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!userData?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const reportPayload = {
        user: userData.id,
        title: reportData.title,
        description: reportData.description,
      };

      await AxiosReportInstance.post("users/", reportPayload, {
        headers: {
          Authorization: `Bearer ${user?.access}`,
        },
      });

      onSuccess();
      onHide();
      setReportData({ title: "", description: "" });
    } catch (err) {
      console.error("Error reporting user:", err);
      setError(err.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="me-2 text-danger" />
          Report User: {userData?.username}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Report Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Spam, Inappropriate Behavior"
              value={reportData.title}
              onChange={(e) =>
                setReportData({ ...reportData, title: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Please provide detailed information about the issue"
              value={reportData.description}
              onChange={(e) =>
                setReportData({ ...reportData, description: e.target.value })
              }
              required
            />
          </Form.Group>

          {error && <div className="alert alert-danger">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
          disabled={
            isSubmitting || !reportData.title || !reportData.description
          }
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReportUserModal;
