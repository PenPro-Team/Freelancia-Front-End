import { useState, useEffect } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { AxiosReportInstance } from "../../network/API/AxiosInstance";
import { FaUserSlash, FaUserCheck } from "react-icons/fa";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import BanUserModal from "./BanUserModal";

function BannedUsersTab() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    const fetchBannedUsers = async () => {
      setIsLoading(true);
      try {
        const res = await AxiosReportInstance.get("/banned-users/", {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        });
        setBannedUsers(res.data.results);
      } catch (err) {
        console.error("Error fetching banned users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannedUsers();
  }, []);

  const handleBanAction = async (userId, action) => {
    try {
      if (action === "ban") {
        await AxiosReportInstance.post(`banned-users/${userId}/`);
      } else {
        await AxiosReportInstance.delete(`banned-users/${userId}/`);
      }

      const res = await AxiosReportInstance.get("banned-users/");
      setBannedUsers(res.data);
    } catch (err) {
      console.error(
        `Error ${action === "ban" ? "banning" : "unbanning"} user:`,
        err
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Loading banned users...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No banned users found
                </td>
              </tr>
            ) : (
              bannedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.is_active ? "success" : "danger"}>
                      {user.is_active ? "Active" : "Banned"}
                    </Badge>
                  </td>
                  <td>
                    {user.is_active ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBanModal(true);
                        }}
                      >
                        <FaUserSlash /> Ban
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBanModal(true);
                        }}
                      >
                        <FaUserCheck /> Unban
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {selectedUser && (
        <BanUserModal
          show={showBanModal}
          onHide={() => setShowBanModal(false)}
          userData={selectedUser}
          isBanned={!selectedUser.is_active}
          onSuccess={() => {
            const fetchBannedUsers = async () => {
              setIsLoading(true);
              try {
                const res = await AxiosReportInstance.get("/banned-users/", {
                  headers: {
                    Authorization: `Bearer ${user.access}`,
                  },
                });
                setBannedUsers(res.data.results);
              } catch (err) {
                console.error("Error fetching banned users:", err);
              } finally {
                setIsLoading(false);
              }
            };
            fetchBannedUsers();
          }}
        />
      )}
    </>
  );
}

export default BannedUsersTab;
