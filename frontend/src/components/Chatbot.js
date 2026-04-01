import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../CSS/Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef(null);

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleOpenChat = () => {
    setIsMinimized(false);

    if (!hasGreeted) {
      const welcomeMessage = {
        type: "bot",
        text: "Hello! I am your shopping assistant, how can I help you?",
        products: [],
      };
      setMessages([welcomeMessage]);
      setHasGreeted(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post(`${baseURL}/api/chat`, { message: input });
      const botMessage = {
        type: "bot",
        text: res.data.reply,
        products: res.data.products || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Something went wrong.", products: [] },
      ]);
    }
  };

  return (
    <div className={`chatbot-container ${isMinimized ? "minimized" : ""}`}>
      {isMinimized ? (
        <button className="chat-toggle-badge" onClick={handleOpenChat}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </button>
      ) : (
        <div className="chat-window-wrapper">
          <div className="chat-header">
            <div className="bot-status">
              <div className="status-dot"></div>
              <span>Shopping Assistant</span>
            </div>

            <button
              className="minimize-btn"
              onClick={() => setIsMinimized(true)}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
              >
                <path d="M19 13H5v-2h14v2z" />
              </svg>
            </button>
          </div>

          <div className="chat-window" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.type}`}>
                <div className={`chat-bubble ${msg.type}`}>{msg.text}</div>
                {msg.products && msg.products.length > 0 && (
                  <div className="chat-products">
                    {msg.products.map((p) => (
                      <div key={p._id} className="chat-product-card">
                        <img src={p.image} alt={p.name} />
                        <div className="product-info">
                          <p className="product-name">{p.name}</p>
                          <p className="product-price">₹{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <div className="input-wrapper">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={sendMessage}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
