import CheckAnimation from './CheckAnimation'
import truncateEthAddress from 'truncate-eth-address'
import CopyToClipboard from './CopyToClipboard'
import DogAnimation from './DogAnimation';

interface ProcessStateProps {
    isSent: boolean;
    bridgeAmount: number;
    txHash: string;
}

const ProcessState: React.FC<ProcessStateProps> = ({
    isSent,
    bridgeAmount,
    txHash
}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
        {isSent? (
            <div className='flex flex-col items-center justify-center'>
                <CheckAnimation />
                <p className="text-center text-gray-400 mt-10">
                🟢 Sent {bridgeAmount} ETH to Optimism Goerli!
                </p>

                <p className='text-white font-bold mt-2'>
                🐾 Tx Hash : {truncateEthAddress(txHash)} 
                <span className='ml-2'><CopyToClipboard textToCopy={txHash} /></span>
                </p>

                <p className='text-white mt-10'>
                🦴 View your transaction on etherscan
                </p>

                <p className='text-white mt-2'>
                🦴 View your transaction on axelar testnet explorer
                </p>
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center'>
                <DogAnimation />
                <p className="text-center text-gray-400 mt-10">
                    Sending {bridgeAmount} ETH to Optimism Goerli 
                </p>

                <p className='text-white font-bold mt-2'>
                    🐾 Tx Hash : {truncateEthAddress(txHash)} 
                    <span className='ml-2'><CopyToClipboard textToCopy={txHash} /></span>
                </p>

                <p className='text-white mt-10'>
                    🦴 Monitor your transaction on etherscan
                </p>

                <p className='text-white mt-2'>
                    🦴 Monitor your transaction on axelar testnet explorer
                </p>
            </div>
        )}
    </div>
  )
}

export default ProcessState