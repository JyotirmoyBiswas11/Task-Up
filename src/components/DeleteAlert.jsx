import React, { useState } from "react";

const AlertMsg = ({OnAlertYes,onAlertNo}) => {
    const [isAlert,setIsAlert] = useState(true)
    const handleUpdateAlert =()=>{
           setIsAlert(!isAlert)
         //  OnAlertData(isAlert)
    }
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-2xl">
        <h2 className="text-lg font-bold text-black">
          Are you sure you want to delete that task?
        </h2>
        <p className="mt-2 text-sm text-black">
          Doing this will permanently delete the task, are you sure it's OK?
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600" onClick={OnAlertYes}
          >
            Yes, I'm sure
          </button>
          <button
            type="button"
            className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-red-600" onClick={onAlertNo}
          >
            No, go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertMsg;