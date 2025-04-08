import { useState, useEffect } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { AxiosWithdrawalsInstance } from "../../network/API/AxiosInstance";
import UpdateWithdrawalModal from "./UpdateWithdrawalModal";
import WithdrawalDetailsModal from "./WithdrawalDetailsModal";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import { BASE_PATH } from "../../network/API/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";

function WithdrawalsTab() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setIsLoading(true);
      try {
        const res = await AxiosWithdrawalsInstance.get("", {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        });
        setWithdrawals(res.data.results || []);
      } catch (err) {
        console.error("Error fetching withdrawals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const handleUpdateClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    if (withdrawal.status === "pending") {
      setShowUpdateModal(true);
    } else {
      setShowDetailsModal(true);
    }
  };

  const handleUpdateSuccess = (updatedWithdrawal) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === updatedWithdrawal.id ? updatedWithdrawal : w))
    );
    setShowUpdateModal(false);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading withdrawal requests...</div>
      ) : (
        <div>
          <div className="m-2 text-end">
            <Link
              variant="primary"
              className="btn btn-primary"
              target="_blank"
              to="https://sandbox.paypal.com/login"
            >
              Paypal Login
            </Link>
          </div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Total Balance</th>
                <th>PayPal Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>{withdrawal.id}</td>
                    <td
                      onClick={() => {
                        navigate(`${BASE_PATH}/Dashboard/${withdrawal.user}`);
                      }}
                      className="text-dark hover-primary"
                      style={{ cursor: "pointer" }}
                    >
                      {withdrawal.user_data?.first_name}{" "}
                      {withdrawal.user_data?.last_name}
                      <br />
                      <small className="text-muted">
                        @{withdrawal.user_data?.username}
                      </small>
                    </td>
                    <td>${withdrawal.amount}</td>
                    <td>${withdrawal.user_data?.user_balance}</td>
                    <td>{withdrawal.paypal_email || "N/A"}</td>
                    <td>{getStatusBadge(withdrawal.status)}</td>
                    <td>{new Date(withdrawal.created_at).toLocaleString()}</td>
                    <td>{withdrawal.notes || "-"}</td>
                    <td>
                      <Button
                        variant={
                          withdrawal.status === "pending"
                            ? "success"
                            : "primary"
                        }
                        size="sm"
                        className="me-2"
                        onClick={() => handleUpdateClick(withdrawal)}
                      >
                        {withdrawal.status === "pending" ? (
                          <FaCheck />
                        ) : (
                          <FaEye />
                        )}{" "}
                        {withdrawal.status === "pending" ? "Process" : "View"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      {selectedWithdrawal && (
        <>
          <UpdateWithdrawalModal
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
            withdrawal={selectedWithdrawal}
            onSuccess={handleUpdateSuccess}
          />
          <WithdrawalDetailsModal
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            withdrawal={selectedWithdrawal}
          />
        </>
      )}
    </>
  );
}

export default WithdrawalsTab;
