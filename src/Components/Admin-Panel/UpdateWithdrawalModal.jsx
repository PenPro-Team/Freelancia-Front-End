import { Modal, Form, Button } from "react-bootstrap";
import { AxiosWithdrawalsInstance } from "../../network/API/AxiosInstance";
import { useState } from "react";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import { FaExclamationTriangle } from "react-icons/fa";

function UpdateWithdrawalModal({ show, onHide, withdrawal, onSuccess }) {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "approved",
    notes: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await AxiosWithdrawalsInstance.patch(
        `${withdrawal.id}/status/`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );
      onSuccess(response.data);
      onHide();
    } catch (err) {
      console.error("Error updating withdrawal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Process Withdrawal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={updateData.status}
              onChange={(e) =>
                setUpdateData({ ...updateData, status: e.target.value })
              }
            >
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Admin Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={updateData.notes}
              onChange={(e) =>
                setUpdateData({ ...updateData, notes: e.target.value })
              }
              placeholder="Enter notes about this withdrawal (optional)"
            />
          </Form.Group>

          {updateData.status === "rejected" && (
            <div className="alert alert-warning">
              <FaExclamationTriangle className="me-2" />
              Rejecting this withdrawal will return the funds to the user's
              wallet.
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant={updateData.status === "approved" ? "success" : "danger"}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : updateData.status === "approved"
            ? "Approve Withdrawal"
            : "Reject Withdrawal"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateWithdrawalModal;
