import { useState, useEffect } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { AxiosReportInstance } from "../../network/API/AxiosInstance";
import ResolveReportModal from "./ResolveReportModal";
import { FaCheck, FaTrash, FaEye } from "react-icons/fa";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import { BASE_PATH } from "../../network/API/AxiosInstance";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ReportDetailsModal from "./ReportDetailsModal";

function UserReportsTab() {
  const [userReports, setUserReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reportType, setReportType] = useState("user");

  useEffect(() => {
    const fetchUserReports = async () => {
      setIsLoading(true);
      try {
        const res = await AxiosReportInstance.get("users/", {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        });
        setUserReports(res.data.results);
      } catch (err) {
        console.error("Error fetching user reports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReports();
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

  // const handleDeleteReport = (report) => {
  //   AxiosReportInstance.delete(`users/${report.id}/`, {
  //     headers: {
  //       Authorization: `Bearer ${user.access}`,
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //       const updatedReports = userReports.filter((r) => r.id !== report.id);
  //       setUserReports(updatedReports);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  const handleDeleteSuccess = () => {
    setUserReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    setShowDeleteModal(false);
  };
  const handleDeleteClick = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const handleResolveSuccess = (updatedReport) => {
    setUserReports((prev) =>
      prev.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      )
    );
    setShowResolveModal(false);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading user reports...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Reported User</th>
              <th>Reporter</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userReports.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No user reports found
                </td>
              </tr>
            ) : (
              userReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td
                    className="text-dark hover-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`${BASE_PATH}/Dashboard/${report.user.id}`);
                    }}
                  >{`${report.user.first_name} ${report.user.last_name}`}</td>
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
          type="user"
          onSuccess={handleResolveSuccess}
        />
      )}

      {selectedReport && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          report={selectedReport}
          type="users"
          onSuccess={handleDeleteSuccess}
        />
      )}

      {selectedReport && (
        <ReportDetailsModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          report={selectedReport}
        />
      )}
    </>
  );
}

export default UserReportsTab;
