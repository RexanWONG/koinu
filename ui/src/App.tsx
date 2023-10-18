import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import KoinuScrollSepolia from "./lib/KoinuScrollSepolia";
import KoinuMantleTestnet from './lib/KoinuMantleTestnet';

const App = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const checkIfWalletIsConnected = async () => {
    if (typeof window.ethereum !== 'undefined') {
        return true
    } else {
        return false
    }
  }

  const connectWallet = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    setIsWalletConnected(await checkIfWalletIsConnected())
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [window.ethereum, isWalletConnected, setIsWalletConnected])

  return (
    <div className='flex justify-center items-center h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500 to-yellow-300'>
      {isWalletConnected ? (
          <KoinuMantleTestnet
            signer={provider.getSigner()}
          />
        ) : (
          <button onClick={connectWallet} className="rounded-lg px-3 py-2 cursor-pointer bg-black hover:bg-white text-white hover:text-black focus:outline-none shadow-lg shadow-neon transition duration-800 hover:ease-in-out">
            Connect Wallet
          </button>
        )}
    </div>
  )
}

export default App