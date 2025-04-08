import { Modal, Button, Badge, Row, Col } from "react-bootstrap";
import {
  FaMoneyBillWave,
  FaInfoCircle,
  FaUser,
  FaPaypal,
} from "react-icons/fa";

function WithdrawalDetailsModal({ show, onHide, withdrawal }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaMoneyBillWave className="me-2" />
          Withdrawal Details: #{withdrawal?.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5 className="mb-3">
            <FaInfoCircle className="me-2" />
            Transaction Information
          </h5>
          <Row>
            <Col md={6}>
              <p>
                <strong>Withdrawal ID:</strong> {withdrawal?.id}
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(withdrawal?.status)}
              </p>
              <p>
                <strong>Amount:</strong> ${withdrawal?.amount}
              </p>
              <p>
                <strong>Fee:</strong> ${withdrawal?.fee || "0.00"}
              </p>
              <p>
                <strong>Net Amount:</strong> ${withdrawal?.net_amount || "0.00"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Created At:</strong>{" "}
                {formatDate(withdrawal?.created_at)}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {formatDate(withdrawal?.updated_at)}
              </p>
              <p>
                <strong>Admin Notes:</strong>
              </p>
              <div className="p-2 bg-light rounded">
                {withdrawal?.notes || "No notes provided"}
              </div>
            </Col>
          </Row>
        </div>

        <div className="mb-4">
          <h5 className="mb-3">
            <FaPaypal className="me-2" />
            Payment Details
          </h5>
          <Row>
            <Col md={6}>
              <p>
                <strong>Payment Method:</strong> PayPal
              </p>
              <p>
                <strong>PayPal Email:</strong>{" "}
                {withdrawal?.paypal_email || "N/A"}
              </p>
              <p>
                <strong>Transaction Reference:</strong>{" "}
                {withdrawal?.transaction_reference || "N/A"}
              </p>
            </Col>
            <Col md={6}>
              {withdrawal?.status === "approved" && (
                <>
                  <p>
                    <strong>Processed At:</strong>{" "}
                    {formatDate(withdrawal?.processed_at)}
                  </p>
                  <p>
                    <strong>Admin Comments:</strong>
                  </p>
                  <div className="p-2 bg-light rounded">
                    {withdrawal?.admin_notes || "No comments provided"}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </div>

        <div className="mb-4">
          <h5 className="mb-3">
            <FaUser className="me-2" />
            User Information
          </h5>
          <Row>
            <Col md={6}>
              <p>
                <strong>User ID:</strong> {withdrawal?.user}
              </p>
              <p>
                <strong>Name:</strong> {withdrawal?.user_data?.first_name}{" "}
                {withdrawal?.user_data?.last_name}
              </p>
              <p>
                <strong>Username:</strong> @{withdrawal?.user_data?.username}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>User Balance:</strong> $
                {withdrawal?.user_data?.user_balance}
              </p>
              <p>
                <strong>Total Withdrawn:</strong> $
                {withdrawal?.user_data?.total_withdrawn || "0.00"}
              </p>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WithdrawalDetailsModal;
