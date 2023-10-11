import { useEffect, useState } from 'react';

const CheckAnimation = () => {
  const [showBox, setShowBox] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBox(true);
    }, 500); // display the box after 500ms

    setTimeout(() => {
      setChecked(true);
    }, 1000); // animate the checkmark after 1000ms
  }, []);

  return (
    <div className="relative">
      <div
        className={`w-10 h-10 border border-gray-600 rounded-md transition-all duration-300 ${showBox ? 'opacity-100' : 'opacity-0'} ${checked ? 'bg-green-500' : 'bg-transparent'}`}
      >
        {checked && (
          <svg
            className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white transition-opacity duration-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
    </div>
  );
};

export default CheckAnimation;
