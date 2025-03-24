import { w3cwebsocket } from "websocket";
import { useState, useEffect, useRef } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import axios from "axios";
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosWSAuthInstance } from "../network/API/AxiosInstance";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uuid, setUuid] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const token = user ? user.access : null;

  useEffect(() => {
    if (!token || uuid) return;

    const fetchUuid = async () => {
      try {
        const response = await AxiosWSAuthInstance.get(``, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("UUID:", response.data.uuid);
        setUuid(response.data.uuid);
      } catch (error) {
        console.error("Error fetching UUID:", error);
      }
    };

    fetchUuid();

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [token, uuid]);

  useEffect(() => {
    if (!uuid || isConnected) return;

    const newClient = new w3cwebsocket(
      `ws://127.0.0.1:8000/ws/chat/lobby/?uuid=${uuid}`
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

      if (event.code === 4001) {
        console.error("Authentication failed - please login again");
      } else if (event.code === 4003) {
        console.error("UUID missing - please refresh and try again");
      } else if (event.code === 4005) {
        console.error("Server database error - please try again later");
      }

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
  }, [uuid, isConnected]);

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
      <HeaderColoredText text="Live Chat" />
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
        onKeyDown={handleKeyPress}
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
