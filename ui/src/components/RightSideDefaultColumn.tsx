interface RightSideDefaultColumnProps {
    chainImage: string;
    chainName: string;
    chainBalance: number;
}

const RightSideDefaultColumn: React.FC<RightSideDefaultColumnProps> = ({
    chainImage,
    chainName,
    chainBalance
}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
        <img 
          src={chainImage}
          alt={chainName}
          className='w-1/6 object-contain'
        />
        <h4 className="scroll-m-20 text-white text-xl font-semibold tracking-tight mt-16">
            You currently have {chainBalance} aUSDC on {chainName}
        </h4>

        <p className="text-center text-gray-400 [&:not(:first-child)]:mt-3 max-w-[450px]">
          If you're low on aUSDC in {chainName}, transfer some aUSDC from another chain by selecting a chain on the left
        </p>
    </div>
  )
}

export default RightSideDefaultColumn