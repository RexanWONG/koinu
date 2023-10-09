interface ChainButtonProps {
    chainImage: string,
    chainName: string,
    chainBalance: number
  }
  
  const ChainButton: React.FC<ChainButtonProps> = ({
    chainImage,
    chainName,
    chainBalance
  }) => {
    const wei = 1000000000000000000
    return (
      <div className="flex flex-row items-center justify-start gap-3 hover:cursor-pointer">
        <img
          src={chainImage} 
          alt={chainName}
          className='w-1/6 object-contain'
        />
  
        <div className="flex flex-col">
          <h4 className="scroll-m-20 text-white text-[15px] font-semibold tracking-tight">
              Optimism Goerli
          </h4>
          <p className=" text-gray-400 text-[14px]">
              {(chainBalance/wei).toFixed(3)} ETH
            </p>
        </div>
      </div>
    )
  }
  
  export default ChainButton