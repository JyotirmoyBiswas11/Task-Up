import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskLightbox({ onClose, onSave,user }) {
    const [taskName, setTaskName] = useState("");
    const [projectName, setProjectName] = useState("");
    const [assignedTo, setAssignedTo] = useState([]);
    const [endDate, setEndDate] = useState(new Date());
    const [priority, setPriority] = useState("Low");
    const [comment, setComment] = useState("");
    const [assignedBy,setAssignedBy] = useState("")
    const [status,setStatus]=useState("pending")
    const [description,setDescription] = useState("")
  
    const handleSave = async () => {
      const newTask = {
        taskName:taskName,
        assignedTo:assignedTo,
        assignedBy:user.email,
        endDate: endDate,
        priority:priority,
        comment:[],
        status: status,
        startDate: new Date(),
        description: description,
      };
  
      await onSave(newTask);
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-md w-1/3">
          <h2 className="text-2xl mb-4">Add Task</h2>
          <div className="mb-4">
            <label className="block mb-2">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Write a short description"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="in-progress">In-Progress</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Task
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default TaskLightbox
  