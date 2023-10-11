import React, { useState } from 'react';
import { IoMdCopy } from 'react-icons/io';

interface Props {
  textToCopy: string;
}

const CopyToClipboard: React.FC<Props> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <button onClick={handleCopyText} title={isCopied ? "Copied!" : "Click to copy"}>
      <div className='flex flex-row items-center justify-center gap-2'>
        <IoMdCopy />
        {isCopied ? ' Copied!' : ' Copy'}
      </div>
    </button>
  );
};

export default CopyToClipboard;