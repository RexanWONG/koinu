import { useEffect, useState, ChangeEvent } from 'react';
import { ethers } from 'ethers';
import { 
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken
} from "@axelar-network/axelarjs-sdk";
import { fetchAUSDCBalance, formatAUSDCBalance, switchChainWithSigner } from '../utils';

import Box from '../components/Box'
import BoxVerticalLine from '../components/BoxVerticalLine'
import Title from '../components/Title'
import ChainButton from '../components/ChainButton';
import Mantle from '../assets/Mantle.png';
import Scroll from '../assets/Scroll.png';
import RightSideDefaultColumn from '../components/RightSideDefaultColumn';
import ActionBar from '../components/ActionBar';
import TransactionStatistics from '../components/TransactionStatistics';
import ProcessState from '../components/ProcessState';

import { scrollSepoliaDeployedAddress, mantleTestnetDeployedAddress } from '../constants/index';
import koinuScrollSepoliaABi from '../constants/KoinuScrollSepolia.json'

interface KoinuMantleTestnetProps {
  signer: any;
}

const KoinuMantleTestnet: React.FC<KoinuMantleTestnetProps> = ({ signer }) => {
  const [connectedAddress, setConnectedAddress] = useState('')
  const [mantleTestnetBalance, setMantleTestnetBalance] = useState(0);
  const [scrollSepoliaBalance, setScrollSepoliaBalance] = useState(0)
  const [gasFee, setGasFee] = useState(0)
  const [txHash, setTxHash] = useState('')
  const [inputValue, setInputValue] = useState({
    scrollSepoliaBridgeAmount: Number(0)
  });

  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false)
  const [isScrollSepoliaSelected, setIsScrollSepoliaSelected] = useState(false);
  const [isChainSwitched, setIsChainSwitched] = useState(false)
  const [isSendToDifferentChainLoading, setIsSendToDifferentChainLoading] = useState(false)
  const [isSentToDifferentChain, setIsSentToDifferentChain] = useState(false)
  const USDC_DECIMALS = 1e6

  const axelarGasSdk = new AxelarQueryAPI({
    environment: Environment.TESTNET,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));   
    
    getEstimatedGasMantleToScroll();
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
    if (chain === 'scroll') {
      setInputValue(prev => ({
        ...prev,
        scrollSepoliaBridgeAmount: Number(formatAUSDCBalance(mantleTestnetBalance))
      }));
    }
  };

  const getEstimatedGasMantleToScroll = async () => {
    try {
      const gmpParams = {
        showDetailedFees: true,
        transferAmount: inputValue.scrollSepoliaBridgeAmount, 
        destinationContractAddress: mantleTestnetDeployedAddress,
        sourceContractAddress: scrollSepoliaDeployedAddress,
        tokenSymbol: "aUSDC"
      }; 
  
      const gas = await axelarGasSdk.estimateGasFee(
        'scroll',
        EvmChain.MANTLE,
        GasToken.ETH,
        700000,
        2,
        '10',
        gmpParams
      );
  
      if (typeof gas !== 'string' && gas.baseFee && gas.executionFee) {
        console.log('gas fee : ', Number(ethers.utils.formatUnits(Number(gas.baseFee) + Number(gas.executionFee))))
        setGasFee(Number(ethers.utils.formatUnits(Number(gas.baseFee) + Number(gas.executionFee))));
      } 
    } catch (error) {
      console.error('Failed to fetch the gas fee', error);
    }
  };

  const switchChainWithSigner = async (signer: any, chainId: number) => {
    try {
      const provider = signer.provider;
  
      if (!provider) {
        alert('Signer is not connected to a provider.');
        return;
      }
  
      const ethereum = (window as any).ethereum;
  
      if (typeof ethereum === 'undefined') {
        alert('Please install MetaMask to use this feature.');
        return;
      }
  
      const targetChainId = `0x${chainId.toString(16)}`;
  
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });

      const newProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const newSigner = newProvider.getSigner()

      return newSigner
  
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error) {
          const switchError = error as { code: number, message?: string };
    
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await (window as any).ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${chainId.toString(16)}`,
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
              alert('Failed to add the chain.');
            }
          } else {
            console.error(switchError);
            alert('Failed to switch chains.');
          }
        } else {
          console.error(error);
          alert('An unknown error occurred.');
        }
    }
  }

  const handleSwitchChain = async (chainName: string) => {
    try {
      if (chainName === 'scroll') {
        const newSigner = await switchChainWithSigner(signer, 534351);

        signer = newSigner;
        console.log(signer);
        setIsChainSwitched(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleCrossChain = async (chainName: string) => {
    try {
      if (chainName === 'scroll') {
        try {
          const newProvider = new ethers.providers.Web3Provider(window.ethereum, "any")
          const newSigner = newProvider.getSigner()

          setIsSendToDifferentChainLoading(true);
          const koinuScrollSepoliaContract = new ethers.Contract(
            scrollSepoliaDeployedAddress,
            koinuScrollSepoliaABi.abi,
            newSigner
          );

          const send = await koinuScrollSepoliaContract.sendToDifferentChain(
            'mantle',
            mantleTestnetDeployedAddress,
            'aUSDC',
            (inputValue.scrollSepoliaBridgeAmount * USDC_DECIMALS),
            {
              value: ethers.utils.parseEther(String(gasFee)),
            }
          );
  
          setTxHash(send.hash);
          await send.wait();
  
          setIsSendToDifferentChainLoading(false);
          setIsSentToDifferentChain(true);
        } catch (error) {
          setIsSendToDifferentChainLoading(false);
          alert(error);
        }
      }
    } catch (error) {
      setIsSendToDifferentChainLoading(false);
      alert(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (signer) {
        await fetchAddress();
        await fetchBalances('scroll')
        await fetchBalances('mantle')

        setTimeout(() => {
          setIsAllDataLoaded(true);
        }, 750);
      }
    }
    fetchData();
  }, [isAllDataLoaded, setIsAllDataLoaded, connectedAddress, setConnectedAddress, signer]);

  useEffect(() => {
    getEstimatedGasMantleToScroll();
  }, [inputValue.scrollSepoliaBridgeAmount]);
  
  
  
  return (
    <Box isAllDataLoaded={isAllDataLoaded}>
      <div className="absolute left-0 top-0 bottom-0 w-1/3 flex flex-col items-start justify-start p-6">
        <Title />

        <div className='mt-6'>
          <div onClick={() => setIsScrollSepoliaSelected(true)} className='p-1 rounded-lg hover:bg-gray-900'>
            <ChainButton 
              chainImage={Scroll}
              chainName={'Scroll Sepolia'}
              chainBalance={formatAUSDCBalance(scrollSepoliaBalance)}
            />
          </div>
        </div>
      </div>

      <BoxVerticalLine />

      <div className="absolute left-1/3 top-0 bottom-0 w-2/3 flex flex-col items-center justify-center">
        {isScrollSepoliaSelected? (
          isSendToDifferentChainLoading ? (
            <ProcessState 
              isSent={false}
              bridgeAmount={inputValue.scrollSepoliaBridgeAmount}
              txHash={txHash}
              backAction={() => {}}
            />
          ) : (
            isSentToDifferentChain ? (
              <ProcessState 
                isSent={true}
                bridgeAmount={inputValue.scrollSepoliaBridgeAmount}
                txHash={txHash}
                backAction={() => setIsSentToDifferentChain(false)}
              />
            ) : (
              <div className='flex flex-col items-center justify-center'>
                  <ActionBar 
                    chainName={'Scroll Sepolia'}
                    action1={() => setIsScrollSepoliaSelected(false)}
                    action2={() => {}}
                  />

                  <div className='flex flex-col items-center justify-center mt-16'>
                    <div className='bg-gray-900 h-[80px] w-[400px] rounded-lg flex items-center justify-start transform hover:scale-105 duration-1000'>
                      <div className='flex flex-col ml-5'>
                        <p className="text-gray-400 text-sm">Amount</p>
                          <input 
                            name='scrollSepoliaBridgeAmount'
                            type='number'
                            placeholder="0"
                            className="bg-transparent border-none text-white text-2xl placeholder-gray-400 w-none outline-none"
                            onChange={handleInputChange}
                            value={inputValue.scrollSepoliaBridgeAmount}
                          /> 
                      </div>
                      <img 
                        src={Scroll}
                        alt='Scroll Sepolia'
                        className='w-[20px] object-contain ml-10 mr-2'
                      /> 
                      <h4 className="text-right scroll-m-20 text-white text-xl font-semibold tracking-tight">
                        aUSDC 
                      </h4>
                    </div>
                    <div className='flex flex-row items-center justify-center text-sm gap-48 mr-4 mt-2'>
                      <p className="text-gray-400">
                        Balance : {formatAUSDCBalance(scrollSepoliaBalance)} aUSDC
                      </p>
                      <p onClick={() => setMaxBalance('scroll')} className='text-red-400 font-extrabold hover:underline hover:cursor-pointer'>
                        MAX
                      </p>
                    </div>

                    <div className='flex flex-col items-start justify-center mt-10'>
                        <TransactionStatistics 
                          chainImage={Scroll}
                          chainName={'Scroll Sepolia'}
                          originalBalance={Number(formatAUSDCBalance(scrollSepoliaBalance))}
                          newBalance={Number((Number(formatAUSDCBalance(scrollSepoliaBalance)) - Number(inputValue.scrollSepoliaBridgeAmount)).toFixed(3))}
                        />

                        <div className='mt-5'>
                          <TransactionStatistics 
                            chainImage={Mantle}
                            chainName={'Mantle Testnet'}
                            originalBalance={Number(formatAUSDCBalance(mantleTestnetBalance))}
                            newBalance={Number(Number(formatAUSDCBalance(mantleTestnetBalance) + Number(inputValue.scrollSepoliaBridgeAmount)).toFixed(3))}
                          />
                        </div>
                    </div>

                    <p className='text-gray-400 text-sm mt-7'>Gas Fee: {gasFee.toFixed(8)} ETH</p>

                    {isChainSwitched ? (
                      <button onClick={() => handleCrossChain('scroll')} className="font-extrabold bg-white hover:bg-gradient-to-l from-white via-orange-500 to-yellow-300 hover:animate-text w-[350px] transition-all duration-150 ease-in-out rounded-xl p-2 mt-7">
                        Bridge from Scroll to Mantle
                      </button>
                    ) : (
                      <button onClick={() => handleSwitchChain('scroll')} className="font-extrabold bg-white hover:bg-gradient-to-l from-white via-orange-500 to-yellow-300 hover:animate-text w-[350px] transition-all duration-150 ease-in-out rounded-xl p-2 mt-7">
                        Switch Chains
                      </button>
                    )}
                  </div>
                </div>
              )
            )
        ) : (
          <RightSideDefaultColumn 
            chainImage={Mantle}
            chainName={'Mantle Testnet'} 
            chainBalance={formatAUSDCBalance(mantleTestnetBalance)}
          />
        )}
      </div>
    </Box>
  )
}

export default KoinuMantleTestnet
