// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Chatbot.css';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([
//     { text: "Hello! I can help you with tutor bookings and questions.", sender: 'bot' }
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate(); // for going back

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;

//     setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
//     setInputValue('');

//     setTimeout(() => {
//       const responses = [
//         "I can help you find available tutors in your area.",
//         "To book a session, visit the tutor's profile and click 'Book Now'.",
//         "Our tutors are available Monday-Friday from 9am-8pm.",
//         "You can filter tutors by subject, availability, or price range."
//       ];
//       const response = responses[Math.floor(Math.random() * responses.length)];
//       setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
//     }, 800);
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <h3>Tutoring Help Bot</h3>
//         <button className="close-btn" onClick={() => navigate(-1)}>×</button>
//       </div>
      
//       <div className="messages-container">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}`}>
//             {msg.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form onSubmit={handleSendMessage} className="input-form">
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           placeholder="Ask about tutors or bookings..."
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default Chatbot;
