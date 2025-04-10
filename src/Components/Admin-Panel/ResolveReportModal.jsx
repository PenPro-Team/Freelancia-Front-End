import { Modal, Form, Button } from "react-bootstrap";
import { AxiosReportInstance } from "../../network/API/AxiosInstance";
import { useState } from "react";
import { getFromLocalStorage } from "../../network/local/LocalStorage";

function ResolveReportModal({ show, onHide, report, type, onSuccess }) {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;

  const [resolveData, setResolveData] = useState({
    status: "resolved",
    resolved_notes: "",
    resolution_reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const endpoint = `${type === "user" ? "users" : "contracts"}/${
        report.id
      }/`;
      const response = await AxiosReportInstance.patch(endpoint, resolveData, {
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      });
      onSuccess(response.data);
    } catch (err) {
      console.error("Error resolving report:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Resolve Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={resolveData.status}
              onChange={(e) =>
                setResolveData({ ...resolveData, status: e.target.value })
              }
            >
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Resolution Reason</Form.Label>
            <Form.Select
              value={resolveData.resolution_reason}
              onChange={(e) =>
                setResolveData({
                  ...resolveData,
                  resolution_reason: e.target.value,
                })
              }
            >
              <option value="violation">Terms violation found</option>
              <option value="no_violation">No violation found</option>
              <option value="false">False report</option>
              <option value="other">Other reason</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Resolution Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={resolveData.resolved_notes}
              onChange={(e) =>
                setResolveData({
                  ...resolveData,
                  resolved_notes: e.target.value,
                })
              }
              placeholder="Enter details about how this report was resolved"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Submit Resolution"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResolveReportModal;
