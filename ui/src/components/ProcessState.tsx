import CheckAnimation from './CheckAnimation'
import truncateEthAddress from 'truncate-eth-address'
import CopyToClipboard from './CopyToClipboard'
import DogAnimation from './DogAnimation';

interface ProcessStateProps {
    isSent: boolean;
    bridgeAmount: number;
    txHash: string;
    backAction: () => void
}

const ProcessState: React.FC<ProcessStateProps> = ({
    isSent,
    bridgeAmount,
    txHash,
    backAction
}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-2'>
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

                <a href={`https://goerli.basescan.org/tx/${txHash}`} target="_blank" className='text-white hover:underline mt-10'>
                🦴 View your transaction on etherscan
                </a>

                <a href={`https://testnet.axelarscan.io/gmp/${txHash}`} target="_blank"className='text-white hover:underline mt-2'>
                🦴 View your transaction on axelar testnet explorer
                </a>

                <button onClick={backAction} className="font-extrabold bg-white hover:bg-gradient-to-l from-white via-orange-500 to-yellow-300 hover:animate-text w-[350px] transition-all duration-150 ease-in-out rounded-xl p-2 mt-28">
                    Great, now go back!
                </button>
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

                <a href={`https://goerli.basescan.org/tx/${txHash}`} target="_blank" className='text-white hover:underline mt-10'>
                🦴 Monitor your transaction on etherscan
                </a>

                <a href={`https://testnet.axelarscan.io/gmp/${txHash}`} target="_blank"className='text-white hover:underline mt-2'>
                🦴 Monitor your transaction on axelar testnet explorer
                </a>
            </div>
        )}
    </div>
  )
}

export default ProcessState