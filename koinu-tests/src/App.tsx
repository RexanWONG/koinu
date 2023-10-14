import { KoinuBaseGoerliProvider } from 'koinu'
import { ethers }  from 'ethers'
import { useEffect, useState } from 'react';

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
    <div className='flex flex-col items-center justify-center mt-16'>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Koinu Tests
      </h1>

      {isWalletConnected ? (
          <KoinuBaseGoerliProvider 
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