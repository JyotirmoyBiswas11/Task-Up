import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, serverTimestamp, getFirestore, getDoc } from "firebase/firestore";
import { app } from "../../firebase";

const firestore = getFirestore(app);

const ChatLightbox = ({ task, sender, onClose }) => {
  const [sortedChats, setSortedChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (Array.isArray(task.comment)) {
      const sorted = [...task.comment].sort((a, b) => new Date(a.timeStamp.seconds * 1000) - new Date(b.timeStamp.seconds * 1000));
      setSortedChats(sorted);
    }
  }, [task.comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const taskRef = doc(firestore, "tasks", task.id);

        // First, update the document to get the current server timestamp
        await updateDoc(taskRef, {
          lastUpdated: serverTimestamp(),
        });

        // Retrieve the updated document to get the current timestamp
        const updatedTaskDoc = await getDoc(taskRef);
        const currentTimestamp = updatedTaskDoc.data().lastUpdated;

        const messageObject = {
          id: Date.now().toString(),
          message: newMessage,
          timeStamp: currentTimestamp,
          userName: sender,
        };

        // Now, add the message to the array
        await updateDoc(taskRef, {
          comment: arrayUnion(messageObject),
        });

        setNewMessage("");
        setSortedChats((prevChats) => [...prevChats, messageObject].sort((a, b) => new Date(a.timeStamp.seconds * 1000) - new Date(b.timeStamp.seconds * 1000)));
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-80 max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            className="text-white hover:text-gray-300"
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
        </div>
        <div className="p-4 h-80 overflow-y-scroll">
          {sortedChats.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-4 rounded-lg shadow-sm ${
                message.userName === sender
                  ? "bg-blue-50 text-blue-900 self-end"
                  : "bg-gray-400 text-gray-900 self-start"
              }`}
            >
              <div className="mb-1">
                <span className="font-semibold">{message.userName}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {message.timeStamp && message.timeStamp.seconds
                    ? new Date(message.timeStamp.seconds * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Sending..."}
                </span>
              </div>
              <p className="text-sm mb-2">{message.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center border-t border-gray-200 p-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatLightbox;
