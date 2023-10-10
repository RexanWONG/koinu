import { useEffect, useState, ChangeEvent } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { formatBalance } from '../utils';

import Box from '../components/Box'
import BoxVerticalLine from '../components/BoxVerticalLine'
import Title from '../components/Title'
import ChainButton from '../components/ChainButton';
import Optimism from '../assets/Optimism.png';
import Base from '../assets/Base.png';
import RightSideDefaultColumn from '../components/RightSideDefaultColumn';
import ActionBar from '../components/ActionBar';
import TransactionStatistics from '../components/TransactionStatistics';

import { baseGoerliDeployedAddress, opGoerliDeployedAddress } from '../constants';
import koinuBaseGoerliAbi from '../constants/KoinuBaseGoerli.json'

interface KoinuBaseGoerliProps {
  signer: any;
}

const KoinuBaseGoerli: React.FC<KoinuBaseGoerliProps> = ({ signer }) => {
  const koinuBaseGoerliConntract = new ethers.Contract(baseGoerliDeployedAddress, koinuBaseGoerliAbi.abi, signer);

  const [connectedAddress, setConnectedAddress] = useState('')
  const [baseGoerliBalance, setBaseGoerliBalance] = useState(0)
  const [optimismGoerliBalance, setOptimismGoerliBalance] = useState(0);
  const [inputValue, setInputValue] = useState({
    optimismGoerliBridgeAmount: Number(0)
  });

  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false)
  const [isOptimismGoerliSelected, setIsOptimismGoerliSelected] = useState(false);
  
  const OP_GOERLI_API_KEY = import.meta.env.VITE_OP_GOERLI_API_KEY;
  const BASE_GOERLI_API_KEY = import.meta.env.VITE_BASE_GOERLI_API_KEY;

  const alchemyOpGoerliProvider = new Alchemy({ apiKey: OP_GOERLI_API_KEY, network: Network.OPT_GOERLI });
  const alchemyBaseGoerliProvider = new Alchemy({ apiKey: BASE_GOERLI_API_KEY, network: Network.BASE_GOERLI });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));    
  };

  const fetchAddress = async () => {
    try {
      const address = await signer.getAddress()
      setConnectedAddress(address)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchBalance = async (alchemy: any, setter: any, address: string) => {
    try {
      const balance = await alchemy.core.getBalance(address, "latest");
      setter(Number(balance));
    } catch (error) {
      console.error(error);
    }
  };

  const setMaxBalance = (chain: string) => {
    if (chain === 'optimismGoerli') {
      setInputValue(prev => ({
        ...prev,
        optimismGoerliBridgeAmount: Number(formatBalance(optimismGoerliBalance))
      }));
    }
  };

  const handleSendToDifferentChain = async (chainName: string) => {
    try {
      if (chainName === 'optimism') {
        const send = await koinuBaseGoerliConntract.sendToDifferentChain(
          chainName,
          opGoerliDeployedAddress,
          'aUSDC',
          inputValue.optimismGoerliBridgeAmount,
          {
            value: ethers.utils.parseEther('0.08')
          }
        )

        await send.wait()
        console.log(send)
      }
    
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        await fetchAddress();
        await fetchBalance(alchemyOpGoerliProvider, setOptimismGoerliBalance, connectedAddress);
        await fetchBalance(alchemyBaseGoerliProvider, setBaseGoerliBalance, connectedAddress);

        setTimeout(() => {
          setIsAllDataLoaded(true);
        }, 750);
    }
    fetchData();
  }, [isAllDataLoaded, setIsAllDataLoaded, connectedAddress, setConnectedAddress, signer]);
  
  return (
    <Box isAllDataLoaded={isAllDataLoaded}>
      <div className="absolute left-0 top-0 bottom-0 w-1/3 flex flex-col items-start justify-start p-6">
        <Title />

        <div className='mt-6'>
          <div onClick={() => setIsOptimismGoerliSelected(true)} className='p-1 rounded-lg hover:bg-gray-900'>
            <ChainButton 
              chainImage={Optimism}
              chainName={'Optimism Goerli'}
              chainBalance={formatBalance(optimismGoerliBalance)}
            />
          </div>
        </div>
      </div>

      <BoxVerticalLine />

      <div className="absolute left-1/3 top-0 bottom-0 w-2/3 flex flex-col items-center justify-center">
        {isOptimismGoerliSelected? (
          <div className='flex flex-col items-center justify-center'>
            <ActionBar 
              chainName={'Optimism Goerli'}
              action1={() => setIsOptimismGoerliSelected(false)}
              action2={() => {}}
            />

            <div className='flex flex-col items-center justify-center mt-16'>
              <div className='bg-gray-900 h-[80px] w-[400px] rounded-lg flex items-center justify-start transform hover:scale-105 duration-1000'>
                <div className='flex flex-col ml-5'>
                  <p className="text-gray-400 text-sm">Amount</p>
                    <input 
                      name='optimismGoerliBridgeAmount'
                      type='number'
                      placeholder="0"
                      className="bg-transparent border-none text-white text-2xl placeholder-gray-400 w-none outline-none"
                      onChange={handleInputChange}
                      value={inputValue.optimismGoerliBridgeAmount}
                    /> 
                </div>
                <img 
                  src={Optimism}
                  alt='Optimism'
                  className='w-[20px] object-contain ml-10 mr-2'
                /> 
                <h4 className="text-right scroll-m-20 text-white text-xl font-semibold tracking-tight">
                  ETH 
                </h4>
              </div>
              <div className='flex flex-row items-center justify-center text-sm gap-48 mr-4 mt-2'>
                <p className="text-gray-400">
                  Balance : {formatBalance(optimismGoerliBalance)} ETH
                </p>
                <p onClick={() => setMaxBalance('optimismGoerli')} className='text-red-400 font-extrabold hover:underline hover:cursor-pointer'>
                  MAX
                </p>
              </div>

              <div className='flex flex-col items-cennter justify-center mt-10'>
                  <TransactionStatistics 
                    chainImage={Optimism}
                    chainName={'Optimism Goerli'}
                    originalBalance={Number(formatBalance(optimismGoerliBalance))}
                    newBalance={Number((Number(formatBalance(optimismGoerliBalance)) - Number(inputValue.optimismGoerliBridgeAmount)).toFixed(3))}
                  />

                  <div className='mt-5'>
                    <TransactionStatistics 
                      chainImage={Base}
                      chainName={'Base Goerli'}
                      originalBalance={Number(formatBalance(baseGoerliBalance))}
                      newBalance={Number(Number(formatBalance(baseGoerliBalance) + Number(inputValue.optimismGoerliBridgeAmount)).toFixed(3))}
                    />
                  </div>
              </div>
              <button onClick={() => handleSendToDifferentChain('optimism')} className="font-extrabold bg-white hover:bg-gradient-to-l from-white via-orange-500 to-yellow-300 hover:animate-text w-[350px] transition-all duration-150 ease-in-out rounded-xl p-2 mt-10">
                Send to OP Goerli!
              </button>
            </div>
          </div>
        ) : (
          <RightSideDefaultColumn 
            chainImage={Base}
            chainName={'Base Goerli'}
            chainBalance={formatBalance(baseGoerliBalance)}
          />
        )}
      </div>
    </Box>
  )
}

export default KoinuBaseGoerli