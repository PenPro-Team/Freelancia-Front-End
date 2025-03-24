import { w3cwebsocket } from "websocket";
import { useState, useEffect, useRef, useCallback } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import axios from "axios";
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosWSAuthInstance } from "../network/API/AxiosInstance";
import Card from "react-bootstrap/Card";
import { WebSocketChatInstance } from "../network/API/WebSocketInstance";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uuid, setUuid] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);
  const isFetchingRef = useRef(false);

  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const token = user ? user.access : null;

  useEffect(() => {
    if (!token) return;
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

    const client = WebSocketChatInstance("lobby", uuid);

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

  return (
    <div>
      <HeaderColoredText text="Live Chat" />
      <div
        className="d-flex justify-content-center"
        style={{ minHeight: "20vh" }}
      >
        <div className="chat-container d-flex flex-column justify-content-between card w-75">
          <div
            className="chat-messages p-2 overflow-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="d-flex flex-column gap-2">
              {messages.map((msg, index) => (
                <div key={index}>
                  <div>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          {" "}
                          <span>{msg.username}</span>
                        </Card.Title>
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                          }}
                        >
                          <span className="text-secondary small fw-bold">
                            {new Date(msg.date).toLocaleTimeString()}
                          </span>
                        </div>
                        <Card.Text>{msg.text}</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-input w-100">
            <div className="p-2 w-100  d-flex gap-2">
              <input
                className="form-control"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isConnected}
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
