import { useEffect, useState } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';
import { formatBalance } from '../utils';

import Box from '../components/Box'
import BoxVerticalLine from '../components/BoxVerticalLine'
import Title from '../components/Title'
import ChainButton from '../components/ChainButton';
import Optimism from '../assets/Optimism.png';
import Base from '../assets/Base.png';
import RightSideDefaultColumn from '../components/RightSideDefaultColumn';
import ActionBar from '../components/ActionBar';

interface KoinuBaseGoerliProps {
  signer: any;
}

const KoinuBaseGoerli: React.FC<KoinuBaseGoerliProps> = ({ signer }) => {
  const [connectedAddress, setConnectedAddress] = useState('')
  const [baseGoerliBalance, setBaseGoerliBalance] = useState(0)
  const [optimismGoerliBalance, setOptimismGoerliBalance] = useState(0);

  const [isOptimismGoerliSelected, setIsOptimismGoerliSelected] = useState(false);
  
  const OP_GOERLI_API_KEY = import.meta.env.VITE_OP_GOERLI_API_KEY;
  const BASE_GOERLI_API_KEY = import.meta.env.VITE_BASE_GOERLI_API_KEY;

  const alchemyOpGoerliProvider = new Alchemy({ apiKey: OP_GOERLI_API_KEY, network: Network.OPT_GOERLI });
  const alchemyBaseGoerliProvider = new Alchemy({ apiKey: BASE_GOERLI_API_KEY, network: Network.BASE_GOERLI });

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

  useEffect(() => {
    const fetchData = async () => {
        await fetchAddress();
        fetchBalance(alchemyOpGoerliProvider, setOptimismGoerliBalance, connectedAddress);
        fetchBalance(alchemyBaseGoerliProvider, setBaseGoerliBalance, connectedAddress);
    }
    fetchData();
  }, [connectedAddress, setConnectedAddress, signer]);
  
  return (
    <Box>
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