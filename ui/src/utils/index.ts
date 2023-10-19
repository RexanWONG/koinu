import { ethers } from 'ethers';
import { Web3Provider } from "@ethersproject/providers";
import { 
    scrollSepoliaDeployedAddress, 
    scrollSepoliaAUSDCAddress, 
    mantleTestnetDeployedAddress, 
    mantleTestnetAUSDCAddress,
    ERC20_ABI
} from '../constants';
import { Network } from 'alchemy-sdk';

const WEI = 1e18;
const USDC_DECIMALS = 1e6

export const formatBalance = (balance: number) => {
    return Number((balance/WEI).toFixed(3))
}

export const formatAUSDCBalance = (balance: number) => {
    return Number((balance/USDC_DECIMALS).toFixed(3))
}

export const switchToScrollSepolia = async (signer: any) => {
    try {
        const newProvider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/scroll_sepolia_testnet')
        const address = await signer.getAddress()
        console.log('switched', newProvider.getSigner(address))
        return newProvider.getSigner(address)
    } catch (error) {
        console.error(error)
    }
}

export const switchChainWithSigner = async (signer: any, chainId: number) => {
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

export const fetchAUSDCBalance = async (chainName: string, signer: any, address: string) => {
    try {
        if (chainName === 'mantle') {
            const ausdcContract = new ethers.Contract(
                mantleTestnetAUSDCAddress, 
                ERC20_ABI, 
                signer.provider
            );

            const balance = await ausdcContract.balanceOf(address);
            return balance.toNumber()
        }

        if (chainName === 'scroll') {
            const scrollSepoliaProvider = new ethers.providers.JsonRpcProvider('https://1rpc.io/scroll/sepolia')
            const ausdcContract = new ethers.Contract(
                scrollSepoliaAUSDCAddress, 
                ERC20_ABI, 
                scrollSepoliaProvider
            );

            const balance = await ausdcContract.balanceOf(address);
            return balance
        }
    } catch (error) {
        console.error('error from balance : ', error)
    }
}
