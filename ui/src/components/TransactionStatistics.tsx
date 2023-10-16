interface TransactionStatisticsProps {
    chainImage: string;
    chainName: string;
    originalBalance: number;
    newBalance: number;
}

const TransactionStatistics: React.FC<TransactionStatisticsProps> = ({
    chainImage,
    chainName,
    originalBalance,
    newBalance,
}) => {
  return (
    <div className='flex flex-row items-center justify-center'>
        <img 
            src={chainImage}
            alt={chainName}
            className='w-[30px] object-contain'
        />

        <div className='flex flex-col items-start justify-start ml-10'>
            <p className='text-gray-400 text-xs'>
            Original balance
            </p>
            <p className='text-white'>
            {originalBalance} aUSDC
            </p>
        </div>

        <div className='flex flex-col items-start justify-start ml-10'>
            <p className='text-gray-400 text-xs'>
                New balance
            </p>
            <p className='text-white'>
                {newBalance} aUSDC
            </p>
        </div>
    </div>
  )
}

export default TransactionStatistics