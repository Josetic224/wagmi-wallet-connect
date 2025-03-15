import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, lisk, liskSepolia, base, polygon, meterTestnet, wmcTestnet } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88"

export const supportedChains = [mainnet, sepolia, lisk, liskSepolia, base, polygon, meterTestnet, wmcTestnet]

export const config = createConfig({
  chains: supportedChains,
  connectors: [
    walletConnect({
      projectId: projectId
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [lisk.id]: http(),
    [liskSepolia.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [meterTestnet.id]: http(),
    [wmcTestnet.id]: http()
  },
})