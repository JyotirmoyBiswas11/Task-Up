import React, { useState, useEffect } from "react";
import DashboardNavbar from "../Layouts/DashboardNavbar";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { app } from "../../firebase";
import TaskLightbox from "../components/TaskLightbox";
import AssignUsers from "../components/AssignUsers";
import { ChatIcon, UsersIcon, TrashIcon } from "@heroicons/react/solid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ChatLightbox from "../components/Chat";
import AlertMsg from "../components/DeleteAlert";
import Dropdown from "../components/Dropdown";
import AssignForNewTAsk from "../components/AssignForNewTAsk";
import AdminSettings from "../components/AdminSettings";

const firestore = getFirestore(app);

function UserDashboard({ user }) {
  const email = user?.email;
  const username = email?.split("@")[0];
  const [senderName, setUserLoginId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isSuperAdmin, setSuperAdmin] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [taskData, setTaskData] = useState([]);
  const [showLightbox, setShowLightbox] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showAssignUser, setShowAssignUser] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [description, setDescription] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState("Low");
  const [isAssignUsersVisible, setAssignUsersVisible] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [projectName,setProjectName] = useState("")
  const [showAdminSettings,setShowAdminSettings] = useState(false)

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        const docRef = doc(firestore, "Users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const isSuperAdmin = userData.role === "superAdmin";
          const isAdmin = userData.role === "admin";
          const sender = userData.userName;
          setUserLoginId(sender);
          setSuperAdmin(isSuperAdmin);
          setAdmin(isAdmin);

          const querySnapshot = await getDocs(collection(firestore, "tasks"));
          let allTasks = [];

          querySnapshot.forEach((doc) => {
            const task = { id: doc.id, ...doc.data() };
            if (
              isSuperAdmin ||
              isAdmin ||
              task.assignedTo?.some((u) => u.uid === uid)
            ) {
              allTasks.push(task);
            }
          });

          if (allTasks.length > 0) {
            allTasks.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
          }

          setTaskData(allTasks);
          setTasks(allTasks);
        }
      }
    });

    // Cleanup function to unsubscribe on component unmount
    return () => unsubscribe();
  }, [showChat,endDate]);

  async function handleUpdateETA(taskId, date) {
    try {
      const taskRef = doc(firestore, "tasks", taskId);
      await updateDoc(taskRef, { endDate: date.toDateString() });
      console.log("Task updated successfully!");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, endDate: date.toDateString() } : task
        )
      );
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  }

  async function handleTaskStatus(taskId) {
    try {
      const taskRef = doc(firestore, "tasks", taskId);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        let statusOrder = ["pending", "inprogress", "completed"];
        if(isSuperAdmin){
           statusOrder = ["pending", "inprogress", "completed","closed"];
        }
        const nextStatus =
          statusOrder[
            (statusOrder.indexOf(taskData.status) + 1) % statusOrder.length
          ];

        await updateDoc(taskRef, { status: nextStatus });
        console.log("Task status updated successfully!");

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: nextStatus } : task
          )
        );
      } else {
        console.error("Task not found: ", taskId);
      }
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  }

  async function handlePriorityChange(taskId, priority) {
    try {
      const taskRef = doc(firestore, "tasks", taskId);
      await updateDoc(taskRef, { priority });
      console.log("Task priority updated successfully!");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, priority } : task
        )
      );
    } catch (error) {
      console.error("Error updating task priority: ", error);
    }
  }
  const getStatusClassName = (status) => {
    if (status === "completed") return "bg-red-100 text-red-600";
    if (status === "inprogress") return "bg-green-100 text-green-600";
    if (status === "closed") return "bg-orange-100 text-orange-600"
    return "bg-yellow-100 text-yellow-600";
  };

  const checkETA = (eta) => {
    const date = new Date();
    const endDate = new Date(eta);
    if (endDate <= date) return "text-red-600";
  };

  const getAssignClassName = (valArr) => {
    if (valArr && valArr.length === 0) return "text-red-400";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        });
  };
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortConfig || !sortConfig.key) {
      return 0; 
    }
  
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";
  
       if (sortConfig.key === "endDate" || sortConfig.key === "startDate") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
  
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
  
    if (sortConfig.direction === "ascending") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  

  const navigate = useNavigate();
  const backToHome = () => {
    navigate("/home");
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskId((prevTaskId) => (prevTaskId === taskId ? null : taskId));
  };

  const handleAssignUserClick = (task) => {
    setCurrentTask(task);
    setShowAssignUser(true);
  };

  async function handleSaveTask() {
    try {
      const tasksCollectionRef = collection(firestore, "tasks");

      const taskToSave = {
        taskName: taskName,
        description: description,
        startDate: new Date().toDateString(),
        endDate: endDate ? endDate.toDateString() : new Date().toDateString(),
        status: "pending",
        priority: priority,
        assignedTo: assignedUsers,
        createdAt: Timestamp.now(),
        assignedBy: username,
        projectName:projectName
      };

      const docRef = await addDoc(tasksCollectionRef, taskToSave);
      console.log("Task added successfully with ID: ", docRef.id);

      setTasks((prevTasks) => [...prevTasks, { id: docRef.id, ...taskToSave }]);

      setTaskName("");
      setDescription("");
      setEndDate(new Date());
      setPriority("low");
      setShowTaskInput(false);
      setAssignedUsers([])
      setProjectName("")
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }

  const handleAssignUsers = (users) => {
    setAssignedUsers(users); // Update assigned users in state
  };
  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteAlert(true);
  };

  const handleAlertYes = async () => {
    try {
      const taskRef = doc(firestore, "tasks", taskToDelete);
      await deleteDoc(taskRef);
      console.log("Task deleted successfully!");

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete)
      );
      setShowDeleteAlert(false);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleAlertNo = () => {
    setTaskToDelete("");
    setShowDeleteAlert(false);
  };
  const handleChatClick = (task) => {
    setCurrentTask(task);
    setShowChat(true);
  };

  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("");

  const handleSearch = (query, searchType) => {
    let filteredTasks = taskData;

    if (searchType === "project name") {
      filteredTasks = filteredTasks.filter((task) =>
        task.projectName?.toLowerCase().includes(query)
      );
    }

    // Filtering by task name
    if (searchType === "task name") {
      filteredTasks = filteredTasks.filter((task) =>
        task.taskName?.toLowerCase().includes(query)
      );
    }

    // Filtering by user name
    if (searchType === "user name") {
      filteredTasks = filteredTasks.filter((task) =>
        task.assignedTo?.some((u) => u.name.toLowerCase().includes(query))
      );
    }

    // Filtering by priority
    if (["low", "medium", "high", "none"].includes(query)) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority?.toLowerCase() === query
      );
      if (query === "none") {
        filteredTasks = taskData;
      }
    }

    // Filtering by status
    if (
      ["pending", "inprogress", "completed", "closed", "none"].includes(query)
    ) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status?.toLowerCase() === query
      );
      if (query === "none") {
        filteredTasks = taskData;
      }
    }

    setTasks(filteredTasks);
  };
const disableButton=(status)=>{
  if(isSuperAdmin) return false;
  if(status==="closed"&&!isSuperAdmin&&!isAdmin) return true
  if(status==="closed"&&isAdmin) return true
  return false
}

  const handleValueFromDropdown = (type, val) => {
    if (val && val.toLowerCase() === "none") {
      setSearchType("");
      setQuery("");
    } else {
      setSearchType(type.toLowerCase());
      setQuery(val.toLowerCase());
    }
    handleSearch(val.toLowerCase(), type.toLowerCase());
  };

  return (
    <>
      <DashboardNavbar />
      <div className="flex items-center justify-center px-10 py-1 bg-gray-50 shadow-md">
        <p className="text-xl font-semibold ">
          Welcome back,{" "}
          <span className="font-bold">
            {username ? username.toUpperCase() : ""}
          </span>
        </p>
        {(isSuperAdmin) && (
          <button
            onClick={() => setShowAdminSettings(true)}
            className="bg-purple-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 absolute top-40 left-40"
          >
            Admin Settings
          </button>
        )}
        {(isSuperAdmin || isAdmin) && (
          <button
            onClick={() => setShowTaskInput(true)}
            className="bg-purple-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 absolute top-40 right-40"
          >
            Add Task
          </button>
        )}
      </div>
      <div className="mx-auto mt-5 p-6 shadow-lg rounded-lg bg-white flex  justify-center">
      <button
          onClick={() => setTasks(taskData)}
          className=" mt-2 justify-center rounded-lg border border-transparent shadow-lg w-24  h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium hover:from-purple-600 hover:to-indigo-600 focus:outline-none transform transition duration-300 ease-in-out"
        >Reset</button>
        <Dropdown
          name={"Select"}
          options={["Project Name", "Task Name","User Name"]}
          handleValueFromDropdown={(val) => handleValueFromDropdown(val, "")}
        />

        <input
          type="text"
          className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-5 "
          placeholder={`Search by ${searchType}`}
          onChange={(e) =>
            handleSearch(e.target.value.toLowerCase(), searchType)
          }
        />
        <Dropdown
          name="Status"
          options={["Pending", "InProgress", "Completed", "Closed", "None"]}
          handleValueFromDropdown={(val) =>
            handleValueFromDropdown("status", val)
          }
        />
        <Dropdown
          name="Priority"
          options={["Low", "Medium", "High", "None"]}
          handleValueFromDropdown={(val) =>
            handleValueFromDropdown("priority", val)
          }
        />
      </div>
      <div className="w-11/12 mx-auto mt-5">
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
            <th className="p-4 w-1/4 text-left">
                <p
                  className="font-semibold cursor-pointer"
                  onClick={() => handleSort("taskName")}
                >
                  Project Name{" "}
                  {sortConfig.key === "projectName" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </p>
              </th>
              <th className="p-4 w-1/4 text-left">
                <p
                  className="font-semibold cursor-pointer"
                  onClick={() => handleSort("taskName")}
                >
                  Task Name{" "}
                  {sortConfig.key === "taskName" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </p>
              </th>

              <th className="p-4 w-1/4 text-left">
                <p
                  className="font-semibold cursor-pointer"
                  onClick={() => handleSort("assignedTo")}
                >
                  Assigned To{" "}
                  {sortConfig.key === "assignedTo" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </p>
              </th>

              <th className="p-4 w-48 text-left">
                <p
                  className="font-semibold cursor-pointer w-48"
                  onClick={() => handleSort("endDate")}
                >
                  ETA{" "}
                  {sortConfig.key === "endDate" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </p>
              </th>
              <th className="p-4 w-48 text-left">
                <p
                  className="font-semibold cursor-pointer ml-5"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </p>
              </th>
              <th className="p-4 w-32 text-left ">Priority</th>
              <th className="p-4  text-right ">
                <p className="mr-20">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
          {showTaskInput && (
  <><tr className="bg-gray-50 border-b border-gray-200">
    <td className="p-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    placeholder="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="p-4">
                {assignedUsers?.map((u) => (
                      <p key={u.uid} className="font-semibold">
                        {u.name}
                      </p>
                    ))}
                  <button
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setAssignUsersVisible(true)}
                  >
                    Assign Users
                  </button>
                </td>

                {isAssignUsersVisible && (
                  <AssignForNewTAsk
                    assignedUsers={assignedUsers}
                    setAssignedUsers={setAssignedUsers}
                    onClose={() => setAssignUsersVisible(false)} />
                )}
                <td className="p-4">
                  <DatePicker
                    selected={endDate}
                    onChange={(d) => setEndDate(d)}
                    dateFormat={"MM/dd/yyyy"}
                    className="bg-white p-3 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="p-4">
                  <p className="text-gray-500 font-medium text-sm">Pending</p>
                </td>
                <td className="p-4 w-full">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td className="p-4 flex justify-center space-x-2">
                  <button
                    className="px-4 py-2 text-white bg-green-600 rounded-lg text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={handleSaveTask}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-red-600 rounded-lg text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => setShowTaskInput(false)}
                  >
                    Cancel
                  </button>

                </td>
              </tr><tr>
                  <td
                    colSpan="6"
                    className="bg-white border-t border-b border-gray-300 p-4"
                  >
                    <div className="flex flex-col space-y-4">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Start Date:
                        </span>{" "}
                        {formatDate(new Date())}
                      </p>
                      <label className="text-lg font-semibold text-gray-700">
                        Description:
                      </label>
                      <ReactQuill
                        value={description}
                        className="bg-white border border-gray-300 rounded-lg w-full h-30"
                        onChange={setDescription} />
                    </div>
                  </td>
                  
                </tr></>
)}


            {sortedTasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr
                  className={`border-b ${getStatusClassName(
                    task.status
                  )} transition-all hover:bg-gray-100`}
                >
                   <td
                    className="p-4 hover:cursor-pointer"
                    onClick={() => toggleTaskExpansion(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">{task.projectName?task.projectName:""}</p>
                    </div>
                  </td>
                  <td
                    className="p-4 hover:cursor-pointer"
                    onClick={() => toggleTaskExpansion(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">{task.taskName}</p>
                    </div>
                  </td>

                  <td className={`p-4 ${getAssignClassName(task.assignedTo)}`}>
                    {task.assignedTo?.map((u) => (
                      <p key={u.uid} className="font-semibold">
                        {u.name}
                      </p>
                    ))}
                  </td>
                  <td className={`p-4 ${checkETA(task.endDate)}`}>
                    <DatePicker
                      selected={
                        task.endDate ? new Date(task.endDate) : new Date()
                      }
                      onChange={(date) => handleUpdateETA(task.id, date)}
                      dateFormat="dd/MM/yyyy"
                      className="bg-white p-2 border rounded-lg w-2/3"
                      disabled={!isSuperAdmin && !isAdmin}
                    />
                  </td>
                  <td
                    className="p-4 cursor-pointer w-20"
                    onClick={() => handleTaskStatus(task.id)}
                  >
                    <button
                      className={`px-4 py-2 rounded-lg ${getStatusClassName(
                        task.status
                      )}`}
                      disabled={disableButton(task.status)}
                    >
                      {task.status ? task.status.toUpperCase() : ""}
                    </button>
                  </td>
                  <td className="p-4 w-20">
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        handlePriorityChange(task.id, e.target.value)
                      }
                      className="p-2 border rounded-lg w-30"
                      disabled={!isSuperAdmin && !isAdmin}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                  <td className="p-4 flex  space-x-2">
                   {(isSuperAdmin||isAdmin)&& <TrashIcon
                      className="w-6 h-6 text-gray-600 cursor-pointer transition-transform transform hover:scale-110"
                      onClick={() => handleDeleteTask(task.id)}
                    />}
                    <ChatIcon
                      className="w-6 h-6 text-gray-600 cursor-pointer transition-transform transform hover:scale-110"
                      onClick={() => handleChatClick(task)}
                    />
                    {(isSuperAdmin || isAdmin) && (
                      <UsersIcon
                        className={`w-6 h-6 text-gray-600 cursor-pointer transition-transform transform hover:scale-110 ${getAssignClassName(
                          task.assignedTo
                        )}`}
                        onClick={() => handleAssignUserClick(task)}
                      />
                    )}
                  </td>
                </tr>
                {expandedTaskId === task.id && (
                  <tr>
                    <td
                      colSpan="6"
                      className=" bg-white border-t border-b border-gray-300"
                    >
                      <div className="flex flex-col space-y-4">
                        <p className="mt-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">
                            Start Date:
                          </span>{" "}
                          {formatDate(task.startDate)}
                        </p>

                        <label className="text-lg font-semibold text-gray-700">
                          Description:
                        </label>

                        {(isSuperAdmin || isAdmin) && (
                          <ReactQuill
                            value={task.description}
                            className="bg-white border border-gray-300 rounded-lg w-2/3"
                            onChange={setDescription}
                          />
                        )}
                        {!isSuperAdmin && !isAdmin && (
                        <div className="text-black w-2/3" dangerouslySetInnerHTML={{ __html: task.description }} />

                        )}
                        <div className="flex ">
                          {(isSuperAdmin || isAdmin) && (
                            <button
                              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                              onClick={() => handleSaveDescription(task.id)}
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Lightbox for Adding a Task */}
      {showLightbox && (
        <TaskLightbox
          onClose={() => setShowLightbox(false)}
          onSave={handleSaveTask}
          user={user}
        />
      )}

      {/* Assign Users Modal */}
      {showAssignUser && currentTask && (
        <AssignUsers
          task={currentTask}
          AdminOrNot={isAdmin}
          SuperAdminOrNot={isSuperAdmin}
          onClose={() => setShowAssignUser(false)}
        />
      )}

      {showChat && currentTask && (
        <ChatLightbox
          task={currentTask}
          sender={senderName}
          onClose={() => setShowChat(false)}
        />
      )}
      {showDeleteAlert && (
        <AlertMsg
          onAlertNo={() => handleAlertNo()}
          OnAlertYes={() => handleAlertYes()}
        />
      )}
          {showAdminSettings && (
        <AdminSettings
         SuperAdminOrNot={isSuperAdmin}
         onClose={()=>setShowAdminSettings(false)}
        />
      )}
    </>
  );
}

export default UserDashboard;
