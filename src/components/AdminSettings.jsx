import React, { useState, useEffect } from "react";
import { getFirestore, collection, updateDoc, doc, getDocs } from "firebase/firestore";
import { app } from "../../firebase";
import SendInvite from "./SendInvite";

const firestore = getFirestore(app);

const AdminSettings = ({ SuperAdminOrNot, onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Users"));
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    getData();
  }, []);

  const handleToggleAdminRole = async (user) => {
    if (!user || !user.id) return;

    const newRole = user.role === "admin" ? "user" : "admin"; // Toggle role
    try {
      const userRef = doc(firestore, "Users", user.id);
      await updateDoc(userRef, { role: newRole });
      console.log(`User role updated to ${newRole}`);
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full sm:w-11/12 md:w-4/5 lg:w-2/3 max-w-full bg-gradient-to-r from-white via-blue-200 to-blue-500 rounded-lg shadow-lg p-8 overflow-y-auto max-h-[90vh]">
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
        <button className="bg-blue-500 px-3 py-1 mb-4" onClick={() => setShowInvite(true)}>Invite</button>
        <input
          type="text"
          placeholder="Search by user name"
          className="w-full p-2 border rounded-md mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-4 mb-6 font-semibold text-sm text-gray-800 bg-gray-400 p-3 rounded-md shadow-md">
          <p className="font-bold">User Name</p>
          <p className="font-bold">Designation</p>
          <p className="font-bold">Role</p>
        </div>
        {filteredUsers.map(user => (
          <div key={user.id} className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-3 gap-4 items-center">
              <p className="text-black font-medium">{user.userName}</p>
              <p className="text-black font-medium">{user.designation}</p>
              <div className="flex items-center">
                {SuperAdminOrNot && (
                  <button
                    className={`ml-2 font-bold py-2 px-4 rounded transition-colors duration-300 ${user.role === "admin" ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    onClick={() => handleToggleAdminRole(user)}
                  >
                    {user.role === "admin" ? 'Admin' : 'User'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showInvite && <SendInvite onClose={() => setShowInvite(false)} />}
    </div>
  );
};

export default AdminSettings;
