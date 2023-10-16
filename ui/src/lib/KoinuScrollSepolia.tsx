import { useEffect, useState, ChangeEvent } from 'react';
import { ethers } from 'ethers';
import { 
  AxelarGMPRecoveryAPI,
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GMPStatusResponse,
  GasToken
} from "@axelar-network/axelarjs-sdk";
import { fetchAUSDCBalance, formatAUSDCBalance } from '../utils';

import Box from '../components/Box'
import BoxVerticalLine from '../components/BoxVerticalLine'
import Title from '../components/Title'
import ChainButton from '../components/ChainButton';
import Mantle from '../assets/Mantle.png';
import Scroll from '../assets/Scroll.png';
import RightSideDefaultColumn from '../components/RightSideDefaultColumn';
import ActionBar from '../components/ActionBar';
import TransactionStatistics from '../components/TransactionStatistics';

import { scrollSepoliaDeployedAddress, mantleTestnetDeployedAddress } from '../constants';
import koinuScrollSepoliaAbi from '../constants/KoinuScrollSepolia.json'
import ProcessState from '../components/ProcessState';

interface KoinuScrollSepoliaProps {
  signer: any;
}

const KoinuScrollSepolia: React.FC<KoinuScrollSepoliaProps> = ({ signer }) => {
  const koinuScrollSepoliaContract = new ethers.Contract(scrollSepoliaDeployedAddress, koinuScrollSepoliaAbi.abi, signer);

  const [connectedAddress, setConnectedAddress] = useState('')
  const [scrollSepoliaBalance, setScrollSepoliaBalance] = useState(0)
  const [mantleTestnetBalance, setMantleTestnetBalance] = useState(0);
  const [gasFee, setGasFee] = useState(0)
  const [txHash, setTxHash] = useState('')
  const [inputValue, setInputValue] = useState({
    mantleTestnetBridgeAmount: Number(0)
  });

  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false)
  const [isOptimismGoerliSelected, setIsOptimismGoerliSelected] = useState(false);
  const [isSendToDifferentChainLoading, setIsSendToDifferentChainLoading] = useState(false)
  const [isSentToDifferentChain, setIsSentToDifferentChain] = useState(false)

  const axelarGasSdk = new AxelarQueryAPI({
    environment: Environment.TESTNET,
  });

  const axelarGmpSdk = new AxelarGMPRecoveryAPI({
    environment: Environment.TESTNET,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));   
    
    getEstimatedGasOpGoerli();
  };

  const fetchAddress = async () => {
    try {
      const address = await signer.getAddress()
      setConnectedAddress(address)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchBalances = async (chainName: string) => {
    if (chainName === 'scroll') {
      const balance = await fetchAUSDCBalance(
        chainName,
        signer,
        signer.getAddress()
      )
      console.log(balance)
      setScrollSepoliaBalance(balance)
    } else if (chainName === 'mantle') {
      const balance = await fetchAUSDCBalance(
        chainName,
        signer,
        connectedAddress
      )
      setMantleTestnetBalance(balance)
    }
  }

  const setMaxBalance = (chain: string) => {
    if (chain === 'mantle') {
      setInputValue(prev => ({
        ...prev,
        optimismGoerliBridgeAmount: Number(formatAUSDCBalance(mantleTestnetBalance))
      }));
    }
  };

  const getEstimatedGasOpGoerli = async () => {
    try {
      const gmpParams = {
        showDetailedFees: true,
        transferAmount: inputValue.mantleTestnetBridgeAmount, 
        destinationContractAddress: mantleTestnetDeployedAddress,
        sourceContractAddress: scrollSepoliaDeployedAddress,
        tokenSymbol: "aUSDC"
      }; 
  
      const gas = await axelarGasSdk.estimateGasFee(
        EvmChain.BASE,
        EvmChain.MANTLE,
        GasToken.ETH,
        700000,
        2,
        '10',
        gmpParams
      );
  
      if (typeof gas !== 'string' && gas.baseFee && gas.executionFee) {
        setGasFee(Number(ethers.utils.formatUnits(Number(gas.baseFee) + Number(gas.executionFee))));
      } 
    } catch (error) {
      console.error('Failed to fetch the gas fee');
    }
  };

  const queryAxelarTx = async (txHash: string) => {
    try {
      const txStatus: GMPStatusResponse = await axelarGmpSdk.queryTransactionStatus(txHash)
      console.log(txStatus)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSendToDifferentChain = async (chainName: string) => {
    try {
      if (chainName === 'mantle') {
        setIsSendToDifferentChainLoading(true)
        const send = await koinuScrollSepoliaContract.sendToDifferentChain(
          chainName,
          mantleTestnetDeployedAddress,
          'aUSDC',
          inputValue.mantleTestnetBridgeAmount,
          {
            value: ethers.utils.parseEther(String(gasFee))
          }
        )

        setTxHash(send.hash)
        await send.wait()

        setIsSendToDifferentChainLoading(false)
        setIsSentToDifferentChain(true)
      }
    
    } catch (error) {
      setIsSendToDifferentChainLoading(false)
      alert(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (signer) {
        await fetchAddress();
        await fetchBalances('scroll')

        setTimeout(() => {
          setIsAllDataLoaded(true);
        }, 750);
      }
    }
    fetchData();
  }, [isAllDataLoaded, setIsAllDataLoaded, connectedAddress, setConnectedAddress, signer]);

  useEffect(() => {
    getEstimatedGasOpGoerli();
  }, [inputValue.mantleTestnetBridgeAmount]);

  useEffect(() => {
    queryAxelarTx(txHash);
  }, [txHash]);
  
  return (
    <Box isAllDataLoaded={isAllDataLoaded}>
      <div className="absolute left-0 top-0 bottom-0 w-1/3 flex flex-col items-start justify-start p-6">
        <Title />

        <div className='mt-6'>
          <div onClick={() => setIsOptimismGoerliSelected(true)} className='p-1 rounded-lg hover:bg-gray-900'>
            <ChainButton 
              chainImage={Mantle}
              chainName={'Mantle Testnet'}
              chainBalance={formatAUSDCBalance(mantleTestnetBalance)}
            />
          </div>
        </div>
      </div>

      <BoxVerticalLine />

      <div className="absolute left-1/3 top-0 bottom-0 w-2/3 flex flex-col items-center justify-center">
        {isOptimismGoerliSelected? (
          isSendToDifferentChainLoading ? (
            <ProcessState 
              isSent={false}
              bridgeAmount={inputValue.mantleTestnetBridgeAmount}
              txHash={txHash}
              backAction={() => {}}
            />
          ) : (
            isSentToDifferentChain ? (
              <ProcessState 
                isSent={true}
                bridgeAmount={inputValue.mantleTestnetBridgeAmount}
                txHash={txHash}
                backAction={() => setIsSentToDifferentChain(false)}
              />
            ) : (
              <div className='flex flex-col items-center justify-center'>
                  <ActionBar 
                    chainName={'Mantle Testnet'}
                    action1={() => setIsOptimismGoerliSelected(false)}
                    action2={() => {}}
                  />

                  <div className='flex flex-col items-center justify-center mt-16'>
                    <div className='bg-gray-900 h-[80px] w-[400px] rounded-lg flex items-center justify-start transform hover:scale-105 duration-1000'>
                      <div className='flex flex-col ml-5'>
                        <p className="text-gray-400 text-sm">Amount</p>
                          <input 
                            name='mantleTestnetBridgeAmount'
                            type='number'
                            placeholder="0"
                            className="bg-transparent border-none text-white text-2xl placeholder-gray-400 w-none outline-none"
                            onChange={handleInputChange}
                            value={inputValue.mantleTestnetBridgeAmount}
                          /> 
                      </div>
                      <img 
                        src={Mantle}
                        alt='Mantle Testnet'
                        className='w-[20px] object-contain ml-10 mr-2'
                      /> 
                      <h4 className="text-right scroll-m-20 text-white text-xl font-semibold tracking-tight">
                        aUSDC 
                      </h4>
                    </div>
                    <div className='flex flex-row items-center justify-center text-sm gap-48 mr-4 mt-2'>
                      <p className="text-gray-400">
                        Balance : {formatAUSDCBalance(mantleTestnetBalance)} aUSDC
                      </p>
                      <p onClick={() => setMaxBalance('mantle')} className='text-red-400 font-extrabold hover:underline hover:cursor-pointer'>
                        MAX
                      </p>
                    </div>

                    <div className='flex flex-col items-start justify-center mt-10'>
                        <TransactionStatistics 
                          chainImage={Mantle}
                          chainName={'Mantle Testnet'}
                          originalBalance={Number(formatAUSDCBalance(mantleTestnetBalance))}
                          newBalance={Number((Number(formatAUSDCBalance(mantleTestnetBalance)) - Number(inputValue.mantleTestnetBridgeAmount)).toFixed(3))}
                        />

                        <div className='mt-5'>
                          <TransactionStatistics 
                            chainImage={Scroll}
                            chainName={'Scroll Sepolia'}
                            originalBalance={Number(formatAUSDCBalance(scrollSepoliaBalance))}
                            newBalance={Number(Number(formatAUSDCBalance(scrollSepoliaBalance) + Number(inputValue.mantleTestnetBridgeAmount)).toFixed(3))}
                          />
                        </div>
                    </div>

                    <p className='text-gray-400 text-sm mt-7'>Gas Fee: {gasFee.toFixed(8)} ETH</p>
                    <button onClick={() => handleSendToDifferentChain('mantle')} className="font-extrabold bg-white hover:bg-gradient-to-l from-white via-orange-500 to-yellow-300 hover:animate-text w-[350px] transition-all duration-150 ease-in-out rounded-xl p-2 mt-7">
                      Send to Mantle Testnet!!
                    </button>
                  </div>
                </div>
              )
            )
        ) : (
          <RightSideDefaultColumn 
            chainImage={Scroll}
            chainName={'Scroll Sepolia'} 
            chainBalance={formatAUSDCBalance(scrollSepoliaBalance)}
          />
        )}
      </div>
    </Box>
  )
}

export default KoinuScrollSepolia
