import { Modal, Button, Badge, Row, Col, Image } from "react-bootstrap";
import {
  FaUser,
  FaFileContract,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import personalImg from "../../assets/default-user.png";
function ReportDetailsModal({ show, onHide, report, type = "user" }) {
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
      reviewed: "info",
      resolved: "success",
      ignored: "secondary",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getResolutionReason = (reason) => {
    const reasons = {
      violation: "Terms violation found",
      no_violation: "No violation found",
      false_report: "False report",
      other: "Other reason",
    };
    return reasons[reason] || reason || "N/A";
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {type === "user" ? (
            <FaUser className="me-2" />
          ) : (
            <FaFileContract className="me-2" />
          )}
          Report Details: {report?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5 className="mb-3">
            <FaExclamationTriangle className="me-2" />
            Report Information
          </h5>
          <Row className="mb-2">
            <Col md={6}>
              <p>
                <strong>Report ID:</strong> {report?.id}
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(report?.status)}
              </p>
              <p>
                <strong>Created At:</strong> {formatDate(report?.created_at)}
              </p>
              <p>
                <strong>Updated At:</strong> {formatDate(report?.updated_at)}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Description:</strong>
              </p>
              <div className="p-2 bg-light rounded">
                {report?.description || "No description provided"}
              </div>
            </Col>
          </Row>
        </div>

        {report?.status === "resolved" && (
          <div className="mb-4 p-3 bg-light rounded">
            <h5 className="mb-3">
              <FaInfoCircle className="me-2" />
              Resolution Details
            </h5>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Resolved By:</strong> {report.resolved_by?.username} (
                  {report.resolved_by?.first_name}{" "}
                  {report.resolved_by?.last_name})
                </p>
                <p>
                  <strong>Resolved At:</strong> {formatDate(report.resolved_at)}
                </p>
                <p>
                  <strong>Resolution Reason:</strong>{" "}
                  {getResolutionReason(report.resolution_reason)}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Resolution Notes:</strong>
                </p>
                <div className="p-2 bg-white rounded">
                  {report.resolved_notes || "No notes provided"}
                </div>
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-4">
          <h5 className="mb-3">
            <FaUser className="me-2" />
            Reporter Information
          </h5>
          <Row className="align-items-center">
            <Col xs={3} className="text-center">
              <Image
                src={report?.reporter?.image || personalImg}
                roundedCircle
                width={80}
                height={80}
                className="border"
              />
            </Col>
            <Col xs={9}>
              <p>
                <strong>Username:</strong> {report?.reporter?.username}
              </p>
              <p>
                <strong>Name:</strong> {report?.reporter?.first_name}{" "}
                {report?.reporter?.last_name}
              </p>
              <p>
                <strong>User ID:</strong> {report?.reporter?.id}
              </p>
            </Col>
          </Row>
        </div>

        <div className="mb-4">
          <h5 className="mb-3">
            {type === "user" ? (
              <FaUser className="me-2" />
            ) : (
              <FaFileContract className="me-2" />
            )}
            Reported {type === "user" ? "User" : "Contract"}
          </h5>
          <Row className="align-items-center">
            <Col xs={3} className="text-center">
              <Image
                src={
                  type === "user"
                    ? report?.user?.image
                    : report?.contract?.freelancer_details?.image || personalImg
                }
                roundedCircle
                width={80}
                height={80}
                className="border"
              />
            </Col>
            <Col xs={9}>
              {type === "user" ? (
                <>
                  <p>
                    <strong>Username:</strong> {report?.user?.username}
                  </p>
                  <p>
                    <strong>Name:</strong> {report?.user?.first_name}{" "}
                    {report?.user?.last_name}
                  </p>
                  <p>
                    <strong>User ID:</strong> {report?.user?.id}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Contract ID:</strong> {report?.contract?.id}
                  </p>
                  <p>
                    <strong>Contract State:</strong>{" "}
                    <Badge bg="info">{report?.contract?.contract_state}</Badge>
                  </p>
                  <p>
                    <strong>Project:</strong>{" "}
                    {report?.contract?.project_details?.project_name || "N/A"}
                  </p>
                </>
              )}
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

export default ReportDetailsModal;
