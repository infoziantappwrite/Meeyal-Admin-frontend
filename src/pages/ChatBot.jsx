import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
    { sender: "bot", text: "You can ask about sales reports, top-selling products, or total revenue." }
  ]);
  const [input, setInput] = useState("");
  const [salesReports, setSalesReports] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/sales_reports")
      .then((response) => setSalesReports(response.data.sales_reports || []))
      .catch((error) => console.error("Error fetching sales reports:", error));
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botResponse = generateResponse(input);
      setMessages([...messages, userMessage, { sender: "bot", text: botResponse }]);
    }, 500);

    setInput("");
  };

  const generateResponse = (query) => {
    query = query.toLowerCase();

    if (query.includes("top selling product")) {
      const topProduct = salesReports.reduce((prev, current) => (prev.quantitySold > current.quantitySold ? prev : current), salesReports[0]);
      return topProduct ? `The top-selling product is ${topProduct.productName} with ${topProduct.quantitySold} units sold.` : "No data available.";
    }

    if (query.includes("total revenue")) {
      const totalRevenue = salesReports.reduce((sum, item) => sum + item.totalRevenue, 0);
      return `The total revenue generated is $${totalRevenue}.`;
    }

    return "Sorry, I didn't understand that. Try asking about sales reports or revenue.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Glowing ChatBot Icon */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-5 rounded-full shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-110 animate-pulse"
      >
        <FaRobot size={28} className="text-yellow-300 drop-shadow-lg" />
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-gray-900 text-white w-96 h-[550px] fixed bottom-20 right-6 rounded-xl shadow-2xl flex flex-col transition-transform transform scale-95 animate-grow border ">
          <div className="bg-gray-800 p-4 flex justify-between items-center rounded-t-xl">
            <h3 className="text-lg font-semibold">ChatBot Assistant</h3>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-3 rounded-lg max-w-xs ${msg.sender === "bot" ? "bg-gray-700 text-left" : "bg-blue-600 text-right ml-auto"}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700 flex">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-800 text-white border-none rounded-l-lg outline-none"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSend} className="bg-blue-600 p-3 rounded-r-lg hover:bg-blue-500">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
