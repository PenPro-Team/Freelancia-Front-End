// import { w3cwebsocket } from "websocket";
import { useState, useEffect, useRef, useCallback } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import axios from "axios";
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosWSAuthInstance } from "../network/API/AxiosInstance";
import Card from "react-bootstrap/Card";
import { WebSocketChatInstance } from "../network/API/WebSocketInstance";
import personalImg from "../assets/default-user.png";
import { BASE_PATH } from "../network/API/AxiosInstance";
import { useSearchParams, useNavigate } from "react-router-dom";

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uuid, setUuid] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);
  const isFetchingRef = useRef(false);
  const messagesContainerRef = useRef(null);

  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const token = user ? user.access : null;
  const chat_room = props.chat_room ? props.chat_room : "lobby";
  const participants = props.participants ? props.participants : [];

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const urlChatRoom = searchParams.get("chat_room");

  const getName = (chat_room) => {
    console.log("Old Chat Room: ", chat_room);
    const usernames = chat_room.split("-");
    const myUsername = usernames.find((name) => name === user?.username);
    console.log("My User Name : ", myUsername);
    const otherUsername = usernames.find((name) => name !== user?.username);
    console.log("Other User Name : ", otherUsername);
    const otherUser = participants.find(
      (participant) => participant.username === otherUsername
    );
    console.log("Other User : ", otherUser);
    return otherUser ? otherUser.name : chat_room;
  };

  const getNameFromUserName = (username) => {
    const user = participants.find(
      (participant) => participant.username === username
    );
    return user ? user.name : chat_room;
  };

  useEffect(() => {
    if (!token) {
      navigate("/Freelancia-Front-End/login");
      return;
    }

    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    AxiosWSAuthInstance.get("", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (uuid !== res.data.uuid) {
          setUuid(res.data.uuid);
        }
        isFetchingRef.current = false;
      })
      .catch(() => {
        isFetchingRef.current = false;
      });
  }, [token]);

  useEffect(() => {
    if (!uuid) return;
    console.log("UUID: ", uuid);
    if (clientRef.current) {
      clientRef.current.close();
    }

    const client = WebSocketChatInstance(chat_room, uuid);

    client.onopen = () => {
      console.log("Connected to the chat server");
      setIsConnected(true);
    };

    client.onmessage = (event) => {
      if (event.data) {
        try {
          const parsedData = JSON.parse(event.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: parsedData.message,
              username: parsedData.sender,
              date: parsedData.message_date,
            },
          ]);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    };

    client.onclose = () => {
      console.log("Disconnected from the chat server");
      setIsConnected(false);
    };

    client.onerror = (error) => {
      if (clientRef.current === client) {
        console.error("WebSocket Error:", error);
        setIsConnected(false);
      }
    };

    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
        clientRef.current = null;
      }
    };
  }, [uuid]);

  useEffect(() => {
    let container = messagesContainerRef.current;
    if (messagesContainerRef.current) {
      container.style.scrollBehavior = "smooth";
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, urlChatRoom]);

  const handleSendMessage = () => {
    if (
      !clientRef.current ||
      clientRef.current.readyState !== clientRef.current.OPEN
    ) {
      console.error("WebSocket is not connected");
      return;
    }

    if (message.trim() === "") return;

    clientRef.current.send(
      JSON.stringify({
        message: message,
      })
    );
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const getUserImage = (username) => {
    if (username === user?.username) {
      return user ? (user.image ? user.image : personalImg) : personalImg;
    }
    const participant = participants.find((p) => p.username === username);
    return participant
      ? participant.image
        ? participant.image
        : personalImg
      : personalImg;
  };

  const getUserID = (username) => {
    if (username === user?.username) {
      return user?.user_id;
    }
    const participant = participants.find((p) => p.username === username);
    return participant?.id || 0;
  };

  return (
    <div>
      <HeaderColoredText text={getName(chat_room)} />
      <div
        className="d-flex justify-content-center"
        style={{ minHeight: "20vh" }}
      >
        <div
          className="chat-container d-flex flex-column justify-content-between card w-100 shadow p-2"
          style={{ backgroundColor: "#000B58" }}
          // style={{ backgroundColor: "#e1e9f7" }}
        >
          <div
            ref={messagesContainerRef}
            className="chat-messages p-2 overflow-auto"
            style={{ height: "80vh", backgroundColor: "#000B58" }}
          >
            <div className="d-flex flex-column gap-2">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.username === user?.username;

                return (
                  <div
                    key={index}
                    className="d-flex"
                    style={{
                      justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    }}
                  >
                    {!isCurrentUser && (
                      <img
                        src={getUserImage(msg.username)}
                        alt={msg.username}
                        onClick={() => {
                          const id = getUserID(msg.username);
                          navigate(`${BASE_PATH}/Dashboard/${id}`);
                        }}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          alignSelf: "flex-end",
                          marginRight: "8px",
                          marginBottom: "16px",
                          cursor: "pointer",
                        }}
                      />
                    )}

                    <div
                      style={{
                        maxWidth: "80%",
                        width: "fit-content",
                        minWidth: "30%",
                      }}
                    >
                      <Card
                        style={{
                          backgroundColor: isCurrentUser
                            ? "#CBDCEB"
                            : "#608BC1",
                          // backgroundColor: isCurrentUser
                          //   ? "#D3E0F4"
                          //   : "#B7CEF0",
                          color: isCurrentUser ? "black" : "white",
                          borderRadius: "10px",
                          padding: "0px",
                        }}
                      >
                        <Card.Body className="p-0 ps-2 pe-2">
                          <div>
                            <span
                              onClick={() => {
                                const id = getUserID(msg.username);
                                navigate(`${BASE_PATH}/Dashboard/${id}`);
                              }}
                              className="fs-5 fw-bold"
                              style={{ cursor: "pointer" }}
                            >
                              {getNameFromUserName(msg.username)}
                            </span>
                          </div>
                          <Card.Text
                            className="m-0"
                            style={{ textAlign: "left" }}
                          >
                            {msg.text}
                          </Card.Text>
                          <div
                            className="mb-4"
                            style={{
                              position: "relative",
                              left: isCurrentUser && "1px",
                              right: !isCurrentUser && "1px",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: isCurrentUser && "1px",
                                right: !isCurrentUser && "1px",
                              }}
                              className={`small fw-bold ${
                                isCurrentUser
                                  ? "text-body-secondary"
                                  : "text-light"
                              }`}
                            >
                              {new Date(msg.date).toLocaleTimeString()}
                            </span>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    {isCurrentUser && (
                      <img
                        src={getUserImage(msg.username)}
                        alt={msg.username}
                        onClick={() => {
                          const id = getUserID(msg.username);
                          navigate(`${BASE_PATH}/Dashboard/${id}`);
                        }}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          alignSelf: "flex-end",
                          marginLeft: "8px",
                          marginBottom: "16px",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="chat-input w-100">
            <div className="p-2 w-100 d-flex gap-2">
              <input
                className="form-control"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isConnected}
                style={{ backgroundColor: "#f2f4f7" }}
              />
              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
                disabled={!isConnected}
              >
                {isConnected ? "Send" : "Connecting..."}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>{!isConnected && uuid && "Connecting to chat..."}</div>
    </div>
  );
};

export default Chat;
