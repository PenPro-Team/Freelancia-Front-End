import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useState, useEffect, useRef } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uuid, setUuid] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const token = user ? user.access : null;

  // First effect: Get UUID when component mounts
  useEffect(() => {
    if (!token) return;

    const fetchUuid = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/auth_for_ws_connection/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("UUID:", response.data.uuid);
        setUuid(response.data.uuid);
      } catch (error) {
        console.error("Error fetching UUID:", error);
      }
    };

    fetchUuid();

    // Cleanup function
    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [token]);

  // Second effect: Establish WebSocket connection when UUID is available
  useEffect(() => {
    if (!uuid) return;

    // Create new WebSocket connection with both UUID and token
    const newClient = new W3CWebSocket(
      `ws://127.0.0.1:8000/ws/chat/lobby/?uuid=${uuid}&token=${token}`
    );

    newClient.onopen = () => {
      console.log("WebSocket Client Connected");
      setIsConnected(true);
    };

    newClient.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: data.message,
            username: data.sender,
            date: data.message_date,
          },
        ]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    newClient.onclose = (event) => {
      console.log("WebSocket Client Disconnected", event);
      setIsConnected(false);

      // Handle different close codes
      if (event.code === 4001) {
        console.error("Authentication failed - please login again");
      } else if (event.code === 4003) {
        console.error("UUID missing - please refresh and try again");
      } else if (event.code === 4005) {
        console.error("Server database error - please try again later");
      }

      // Attempt reconnection for network errors (code 1006)
      if (event.code === 1006) {
        console.log("Attempting to reconnect...");
        setTimeout(() => setUuid((uuid) => uuid), 2000);
      }
    };

    newClient.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsConnected(false);
    };

    clientRef.current = newClient;

    return () => {
      if (newClient.readyState === newClient.OPEN) {
        newClient.close(1000, "Component unmounting");
      }
    };
  }, [uuid, token]); // Added token to dependencies

  const sendMessage = () => {
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <h1>Live Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.text}
            <small> ({new Date(msg.date).toLocaleTimeString()})</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={!isConnected}
      />
      <button onClick={sendMessage} disabled={!isConnected}>
        {isConnected ? "Send" : "Connecting..."}
      </button>
      <div>{!isConnected && uuid && "Connecting to chat..."}</div>
    </div>
  );
};

export default Chat;
