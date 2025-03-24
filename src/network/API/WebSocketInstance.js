import { w3cwebsocket as W3CWebSocket } from "websocket";

const WS_BASE_URL = "ws://127.0.0.1:8000/ws/chat";

export const WebSocketChatInstance = (room, uuid) => {
  return new W3CWebSocket(`${WS_BASE_URL}/${room}/?uuid=${uuid}`);
};
