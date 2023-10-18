export const baseGoerliDeployedAddress = '0x07EAc99586339dAF2cec9aDd737Ec7EaA9B0F38B';
export const opGoerliDeployedAddress = '0x1dc5e31244594077B0Df557a449b34F0677E214B';
export const scrollSepoliaDeployedAddress = '0x359B573359DDaF99856F2F036894A5DaD30d55C4';
export const mantleTestnetDeployedAddress = '0x359B573359DDaF99856F2F036894A5DaD30d55C4';

export const scrollSepoliaAUSDCAddress = '0x254d06f33bDc5b8ee05b2ea472107E300226659A'
export const mantleTestnetAUSDCAddress = '0x254d06f33bDc5b8ee05b2ea472107E300226659A'

export const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];