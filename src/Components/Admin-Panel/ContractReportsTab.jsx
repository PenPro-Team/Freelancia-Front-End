import { useState, useEffect } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { AxiosReportInstance } from "../../network/API/AxiosInstance";
import ResolveReportModal from "./ResolveReportModal";
import { FaCheck, FaTrash, FaEye } from "react-icons/fa";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { BASE_PATH } from "../../network/API/AxiosInstance";
import { useNavigate } from "react-router-dom";
import ReportDetailsModal from "./ReportDetailsModal";

function ContractReportsTab() {
  const [contractReports, setContractReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reportType, setReportType] = useState("Contract");

  useEffect(() => {
    const fetchContractReports = async () => {
      setIsLoading(true);
      try {
        const res = await AxiosReportInstance.get("contracts/", {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        });
        setContractReports(res.data.results);
      } catch (err) {
        console.error("Error fetching contract reports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractReports();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      reviewed: "info",
      resolved: "success",
      ignored: "secondary",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const handleResolveClick = (report) => {
    setSelectedReport(report);
    setShowResolveModal(true);
  };

  const handleResolveSuccess = (updatedReport) => {
    setContractReports((prev) =>
      prev.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      )
    );
    setShowResolveModal(false);
  };

  const handleDeleteClick = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    setContractReports((prev) =>
      prev.filter((r) => r.id !== selectedReport.id)
    );
    setShowDeleteModal(false);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading contract reports...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Reported Contract</th>
              <th>Reporter</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contractReports.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No contract reports found
                </td>
              </tr>
            ) : (
              contractReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td
                    onClick={() => {
                      navigate(
                        `${BASE_PATH}/contractDetails/${report.contract.id}`
                      );
                    }}
                    className="text-dark hover-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Contract ID: {report.contract.id}
                  </td>
                  <td
                    onClick={() => {
                      navigate(`${BASE_PATH}/Dashboard/${report.reporter.id}`);
                    }}
                    className="text-dark hover-primary"
                    style={{ cursor: "pointer" }}
                  >
                    {report.reporter.username}
                  </td>
                  <td>{report.title}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleResolveClick(report)}
                      disabled={
                        report.status === "resolved" ||
                        report.status === "ignored"
                      }
                    >
                      <FaCheck /> Resolve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDeleteClick(report)}
                    >
                      <FaTrash /> Delete
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setShowDetailsModal(true);
                      }}
                    >
                      <FaEye /> View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {selectedReport && (
        <ResolveReportModal
          show={showResolveModal}
          onHide={() => setShowResolveModal(false)}
          report={selectedReport}
          type="contract"
          onSuccess={handleResolveSuccess}
        />
      )}

      {selectedReport && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          report={selectedReport}
          type="contracts"
          onSuccess={handleDeleteSuccess}
        />
      )}
      {selectedReport && (
        <ReportDetailsModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          report={selectedReport}
          type="Contract"
        />
      )}
    </>
  );
}

export default ContractReportsTab;
