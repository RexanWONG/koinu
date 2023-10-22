import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import KoinuMantleTestnet from './lib/KoinuMantleTestnet';
import { fetchAUSDCBalance, formatAUSDCBalance } from './utils';

const App = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState('')
  const [mantleBalance, setMantleBalance] = useState(0)

  const [showKoinu, setShowKoinu] = useState(false)

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

  const fetchAddress = async () => {
    try {
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      setConnectedAddress(address)
    } catch (error) {
      console.error(error)
    }
  }

  const handleFetchMantleBalance = async () => {
    const balance = await fetchAUSDCBalance(
      'mantle',
      provider.getSigner(),
      connectedAddress
    )

    console.log(balance)
      
    setMantleBalance(balance)
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    fetchAddress()
    handleFetchMantleBalance()
  }, [window.ethereum, isWalletConnected, setIsWalletConnected, connectedAddress, setConnectedAddress])

  return (
    <div className='flex justify-center items-center h-screen bg-black'>
      {isWalletConnected ? (
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold tracking-tight text-white'>
              Your wallet : {connectedAddress}
            </h1>
            {formatAUSDCBalance(mantleBalance) < 500 ? (
              <div className='flex flex-col items-center justify-center'>
                  <p className='scroll-m-20 text-xl tracking-tight text-white mt-10'>
                    You have {formatAUSDCBalance(mantleBalance)} aUSDC on Mantle.  You need at least 500 aUSDC to join
                  </p>

                  {showKoinu ? (
                    <div />
                  ) : (
                    <button onClick={() => setShowKoinu(true)} className="rounded-lg border-2 border-gray-700 px-3 py-2 cursor-pointer bg-black hover:bg-white text-white hover:text-black focus:outline-none shadow-lg shadow-neon transition duration-800 hover:ease-in-out mt-5">
                      Transfer aUSDC from a different chain?
                    </button>
                  )}
              </div>
            ) : (
              <button onClick={connectWallet} className="rounded-lg px-3 py-2 cursor-pointer bg-green hover:bg-white text-white hover:text-black focus:outline-none shadow-lg shadow-neon transition duration-800 hover:ease-in-out">
                Mantle!  Join the DAO!!! Buy the NFT!!!
              </button>
            )}

            {!showKoinu ? (
              <div className='mt-5'>
                <KoinuMantleTestnet
                  signer={provider.getSigner()}
                />
              </div>
            ) : (
              <div />
            )} 
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center max-w-[500px]'>
            <h1 className='text-5xl mb-5'>🐕</h1>
            <p className='text-white'>THIS DAPP IS ON MANTLE TESTENT</p>
            <p className='text-white mt-10'>Demo dapp showcasing one example of a powerul usecase of Koinu</p>
            <p className='text-white mt-10 text-center'>To get the best demo experience, try having 0 aUSDC on Mantle Testnet and 500 aUSDC on Scroll Sepolia.  You can get aUSDC from the channel 'faucet' on Axelar's discord server</p>
            <p className='text-white mt-10 text-center'>Make sure you connect your wallet to mantle testnet</p>
            <button onClick={connectWallet} className="border-2 border-gray-700 rounded-lg px-3 py-2 cursor-pointer bg-black hover:bg-white text-white hover:text-black focus:outline-none shadow-lg shadow-neon transition duration-800 hover:ease-in-out mt-20">
              Connect Wallet
            </button>
          </div>
        )}
    </div>
  )
}

export default App