import { getFromLocalStorage } from "../network/local/LocalStorage";
import { AxiosChatInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Spinner from "react-bootstrap/Spinner";
import Chat from "./chat";
import HeaderColoredText from "../Components/HeaderColoredText";
import { useSearchParams, useNavigate } from "react-router-dom";

const ChatRooms = (props) => {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const token = user ? user.access : null;
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState("first");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlChatRoom = searchParams.get("chat_room");

  useEffect(() => {
    if (!token) {
      navigate("/Freelancia-Front-End/login");
      return;
    }

    setLoading(true);
    AxiosChatInstance.get("userchatrooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setChatRooms(res.data);
        setError(null);
        if (res.data.length > 0) {
          const roomFromUrl = urlChatRoom
            ? res.data.find((room) => room.name === urlChatRoom)
            : null;

          setActiveKey(
            roomFromUrl ? roomFromUrl.id.toString() : res.data[0].id.toString()
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching chat rooms:", err);
        setError("Failed to load chat rooms");
        setChatRooms([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger p-3">{error}</div>;
  }

  if (chatRooms.length === 0) {
    return <div className="p-3">No chat rooms available</div>;
  }

  const handleTabSelect = (selectedKey) => {
    setActiveKey(selectedKey);
    const selectedRoom = chatRooms.find(
      (room) => room.id.toString() === selectedKey
    );
    if (selectedRoom) {
      navigate(`?chat_room=${selectedRoom.name}`);
    }
  };

  return (
    <div className="container-fluid px-5">
      <HeaderColoredText text="Chatting" />
      <Tab.Container
        id="chat-rooms-tabs"
        activeKey={activeKey}
        onSelect={handleTabSelect}
      >
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column m-5">
              {chatRooms.map((chatRoom) => {
                const isActive = chatRoom.id.toString() === activeKey;
                return (
                  <Nav.Item key={chatRoom.id}>
                    <Nav.Link
                      eventKey={chatRoom.id.toString()}
                      className={`custom-tab ${isActive ? "active" : ""}`}
                    >
                      <div className="d-flex flex-column">
                        <strong>{chatRoom.name}</strong>
                        <small className="text-light">
                          {chatRoom.participants?.length || 0} participants
                        </small>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {chatRooms.map((chatRoom) => (
                <Tab.Pane key={chatRoom.id} eventKey={chatRoom.id.toString()}>
                  <Chat
                    chat_room={chatRoom.name}
                    participants={chatRoom.participants || []}
                    key={chatRoom.id}
                  />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default ChatRooms;
