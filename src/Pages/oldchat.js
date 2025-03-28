import { w3cwebsocket as W3CWebSocket } from "websocket";
import { cache, useState } from "react";
import { useEffect } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import axios from "axios";

const auth = getFromLocalStorage("auth");
const user = auth ? auth.user : null;
const token = user ? user.access : null;
console.log(auth);
console.log("User: ", user);
console.log(token);
// const client = new W3CWebSocket(
//   `ws://127.0.0.1:8000/ws/chat/lobby/?token=${token}`
// );

// const uuid = cache(auth.user.user_id);
// cach
// caches.open("uuid").then(cache.addAll).catch()

const Chat = () => {
  console.log("AAAAAAAAAAAA", auth["user"]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uuid, setUuid] = useState();
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/auth_for_ws_connection/`, {
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log("uuid:", response.data["uuid"]);
        setUuid(response.data["uuid"]);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
      });
  }, [user.user_id]);

  const client = new W3CWebSocket(
    `ws://127.0.0.1:8000/ws/chat/lobby/?uuid=${uuid}`
  );

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.message, username: data.username },
      ]);
    };
  }, [uuid]);

  const sendMessage = () => {
    client.send(JSON.stringify({ message: message }));
    setMessage("");
  };

  return (
    <div>
      <h1>Live Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
