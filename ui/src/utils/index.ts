import { ethers } from 'ethers';

const erc20Abi = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
];

export const getBalanceOfAUSDC = async (
    contractAddress: string,
    userAddress: string,
    providerUrl: string
  ) => {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
  
    try {
      const balance = await contract.balanceOf(userAddress);

      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error(`Failed to fetch balance: ${error}`);
      throw error;
    }
}