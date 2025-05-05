import React, { useState } from 'react';

const Dropdown = ({ name, options, handleValueFromDropdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionValue,setOptionValue]=useState(name)

  const decideName=()=>{
    if(optionValue!==name){
        if(optionValue==="None") {return name }
        return optionValue
       
    }

    return name
  }

  return (
    <div className="relative inline-block text-left ml-5 mt-2">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center w-full rounded-lg border border-transparent shadow-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium hover:from-purple-600 hover:to-indigo-600 focus:outline-none transform transition duration-300 ease-in-out"
        >
          {decideName()}
          <svg
            className="-mr-1 ml-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-300 ease-in-out scale-95 z-20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {options.map((option, index) => (
              <a
                key={index}
                href="#"
                className={`text-gray-700 block px-4 py-2 text-sm hover:bg-gradient-to-r ${
                  index % 2 === 0
                    ? 'from-blue-500 to-purple-500'
                    : 'from-blue-500 to-indigo-500'
                } hover:text-white rounded-lg transform transition duration-300 ease-in-out`}
                role="menuitem"
                tabIndex="-1"
                onClick={() => {handleValueFromDropdown(option);setIsOpen(false);setOptionValue(option)}}
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
