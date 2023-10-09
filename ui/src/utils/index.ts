const WEI = 1e18;

export const formatBalance = (balance: number) => {
    return Number((balance/WEI).toFixed(3))
}