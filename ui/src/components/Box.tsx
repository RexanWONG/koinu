import React from 'react';

interface BoxProps {
  children?: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({ children }) => {
  return (
    <div className='relative bg-black border border-gray-600 rounded-2xl h-[550px] w-[800px] flex items-center justify-center hover:shadow-xl'>
      {children}
    </div>
  )  
}

export default Box;