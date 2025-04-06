// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: "Hello! How can I help you with Freelancia today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState({});
  const [sessionId, setSessionId] = useState(null);

  const messagesEndRef = useRef(null);

  const API_BASE_URL = "http://127.0.0.1:8000";
  const ASK_API_URL = `${API_BASE_URL}/chatbot/ask/`;
  const FEEDBACK_API_URL = `${API_BASE_URL}/chatbot/feedback/`;

  useEffect(() => {
    const generatedSessionId = uuidv4();
    setSessionId(generatedSessionId);
    console.log("Generated Chat Session ID:", generatedSessionId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => setIsOpen(!isOpen);
  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleSendMessage = async (event) => {
    if (event) event.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading || !sessionId) return;

    const userMessage = { id: Date.now(), text: trimmedInput, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(ASK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedInput,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(
          errorData.error || `Network error (${response.status})`
        );
      }

      const data = await response.json();

      if (data.session_id && sessionId !== data.session_id) {
        console.log("Received session ID from backend:", data.session_id);
        setSessionId(data.session_id);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.answer || "Sorry, I couldn't get a response.",
        sender: "bot",
        originalQuestion: trimmedInput,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Failed to fetch chatbot response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message || "Could not connect."}`,
        sender: "bot",
        isError: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 0);
    }
  };

  const handleSendFeedback = async (
    messageId,
    question,
    responseText,
    rating
  ) => {
    if (feedbackSent[messageId]) return;
    console.log(
      `Sending feedback for Q: "${question}" | A: "${responseText.substring(
        0,
        30
      )}..." | Rating: ${rating}`
    );
    try {
      const apiResponse = await fetch(FEEDBACK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question,
          response: responseText,
          rating: rating,
        }),
      });
      if (!apiResponse.ok) {
        const errorData = await apiResponse
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(
          errorData.error || `Feedback failed (${apiResponse.status})`
        );
      }
      const result = await apiResponse.json();
      console.log("Feedback submitted:", result);
      setFeedbackSent((prev) => ({ ...prev, [messageId]: true }));
    } catch (error) {
      console.error("Failed to send feedback:", error);
    }
  };

  return (
    <>
      <button
        className={`btn chatbot-toggler ${
          isOpen ? "btn-danger" : "btn-primary"
        }`}
        onClick={toggleChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-chat-dots-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg>
      </button>

      {isOpen && (
        <div className="card chat-window">
          <div className="card-header bg-primary text-white">
            Freelancia Assistant
            <button
              type="button"
              className="btn-close btn-close-white float-end"
              aria-label="Close"
              onClick={toggleChat}
            ></button>
          </div>
          <div className="card-body chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                } ${message.isError ? "error-message" : ""}`}
              >
                <div className="message-text">{message.text}</div>
                {message.sender === "bot" &&
                  message.originalQuestion &&
                  !message.isError && (
                    <div className="message-feedback mt-1">
                      <button
                        className={`btn btn-sm btn-outline-success me-1 ${
                          feedbackSent[message.id] ? "disabled" : ""
                        }`}
                        onClick={() =>
                          handleSendFeedback(
                            message.id,
                            message.originalQuestion,
                            message.text,
                            1
                          )
                        }
                        disabled={feedbackSent[message.id]}
                        title="Good response"
                      >
                        👍
                      </button>
                      <button
                        className={`btn btn-sm btn-outline-danger ${
                          feedbackSent[message.id] ? "disabled" : ""
                        }`}
                        onClick={() =>
                          handleSendFeedback(
                            message.id,
                            message.originalQuestion,
                            message.text,
                            -1
                          )
                        }
                        disabled={feedbackSent[message.id]}
                        title="Bad response"
                      >
                        👎
                      </button>
                    </div>
                  )}
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
          <div className="card-footer chat-input-form">
            <form onSubmit={handleSendMessage} className="d-flex flex-grow-1">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Ask something..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !inputValue.trim() || !sessionId}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-send-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
