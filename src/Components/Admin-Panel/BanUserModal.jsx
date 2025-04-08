import { Modal, Button } from "react-bootstrap";
import { AxiosReportInstance } from "../../network/API/AxiosInstance";
import { useState } from "react";
import { FaUserSlash, FaUserCheck } from "react-icons/fa";
import { getFromLocalStorage } from "../../network/local/LocalStorage";

function BanUserModal({ show, onHide, userData, isBanned, onSuccess }) {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleBanAction = async () => {
    if (!userData?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = `banned-users/${userData.id}/`;

      if (isBanned) {
        await AxiosReportInstance.delete(endpoint, {
          headers: {
            Authorization: `Bearer ${user?.access}`,
          },
        });
      } else {
        await AxiosReportInstance.post(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.access}`,
            },
          }
        );
      }

      onSuccess();
      onHide();
    } catch (err) {
      console.error(`Error ${isBanned ? "unbanning" : "banning"} user:`, err);
      setError(
        err.response?.data?.message ||
          `Failed to ${isBanned ? "unban" : "ban"} user`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className={isBanned ? "text-success" : "text-danger"}>
          {isBanned ? (
            <FaUserCheck className="me-2" />
          ) : (
            <FaUserSlash className="me-2" />
          )}
          {isBanned ? "Unban User" : "Ban User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to {isBanned ? "unban" : "ban"} this user?</p>
        <p className="fw-bold">
          User: {userData?.username} (ID: {userData?.id})
        </p>
        <p className="text-muted">
          {isBanned
            ? "This will restore the user's access to the platform."
            : "This will immediately revoke the user's access to the platform."}
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant={isBanned ? "success" : "danger"}
          onClick={handleBanAction}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : isBanned
            ? "Confirm Unban"
            : "Confirm Ban"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BanUserModal;
