import { w3cwebsocket as W3CWebSocket } from "websocket";

const url = "ws://127.0.0.1:8000";

const getWebSocketUrl = () => {
  const auth = localStorage.getItem("auth");
  const user = auth ? JSON.parse(auth).user : null;
  const token = user ? user.access : null;
  return `${url}/ws/chat/lobby/?token=${token}`;
};

export const createWebSocketClient = () => {
  const url = getWebSocketUrl();
  return new W3CWebSocket(url);
};
