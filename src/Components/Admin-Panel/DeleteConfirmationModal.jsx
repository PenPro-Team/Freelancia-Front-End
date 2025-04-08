import { Modal, Button } from "react-bootstrap";
import { AxiosReportInstance } from "../../network/API/AxiosInstance";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

function DeleteConfirmationModal({ show, onHide, report, type, onSuccess }) {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await AxiosReportInstance.delete(`${type}/${report.id}/`, {
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      });
      onSuccess();
      onHide();
    } catch (err) {
      console.error("Error deleting report:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaExclamationTriangle className="me-2" />
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete this{" "}
          {type === "users" ? "user" : "contract"} report?
        </p>
        <p className="fw-bold">Report ID: {report.id}</p>
        <p className="text-muted">
          This action cannot be undone. All data related to this report will be
          permanently removed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Permanently"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmationModal;
