import { IoChevronBackOutline, IoInformation } from 'react-icons/io5';

interface ActionBarProps {
    chainName: string;
    action1: () => void;
    action2: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  chainName,
  action1,
  action2
}) => {
  return (
    <div className='flex flex-row items-center justify-center gap-32'>
      <div onClick={action1} className='text-gray-500 hover:text-white hover:cursor-pointer'>
        <IoChevronBackOutline size='25px'/>
      </div>

      <h4 className="scroll-m-20 text-white text-xl font-extrabold tracking-tight">
        {chainName}
      </h4>

      <div onClick={action2} className='text-gray-500 hover:text-white hover:cursor-pointer'>
        <IoInformation size='25px'/>
      </div>
    </div>
  )
}

export default ActionBar