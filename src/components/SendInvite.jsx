import React, { useState } from "react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { app } from "../../firebase"; 

const auth = getAuth(app);

const SendInvite = ({onClose}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    
    if (email.length===0) {
      setMessage("Please enter an email.");
      return;
    }

    setIsSending(true);
    const actionCodeSettings = {
      url: 'https://project-management-pravaah.web.app/', 
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setMessage("Invite sent! Please ask the user to check their email.");
    } catch (error) {
      setMessage(`Error sending Invite link: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md absolute top-80">
      <h2 className="text-2xl font-bold mb-4">Send Invite </h2>
      <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      <form onSubmit={handleSendMagicLink}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full p-2 rounded ${isSending ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send Invite Link"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default SendInvite;
