import { ethers } from 'ethers';
import { 
    scrollSepoliaDeployedAddress, 
    scrollSepoliaAUSDCAddress, 
    mantleTestnetDeployedAddress, 
    mantleTestnetAUSDCAddress,
    ERC20_ABI
} from '../constants';

const WEI = 1e18;
const USDC_DECIMALS = 1e6

export const formatBalance = (balance: number) => {
    return Number((balance/WEI).toFixed(3))
}

export const formatAUSDCBalance = (balance: number) => {
    return Number((balance/USDC_DECIMALS).toFixed(3))
}

export const fetchAUSDCBalance = async (chainName: string, signer: any, address: string) => {
    try {
        if (chainName === 'scroll') {
            const ausdcContract = new ethers.Contract(
                scrollSepoliaAUSDCAddress, 
                ERC20_ABI, 
                signer.provider
            );

            const balance = await ausdcContract.balanceOf(address);
            return balance.toNumber()
        }

        if (chainName === 'mantle') {
            const mantleTestnetProvider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.mantle.xyz')
            const ausdcContract = new ethers.Contract(
                mantleTestnetAUSDCAddress, 
                ERC20_ABI, 
                mantleTestnetProvider
            );

            const balance = await ausdcContract.balanceOf(address);
            return balance
        }
    } catch (error) {
        console.error('error from balance : ', error)
    }
}
