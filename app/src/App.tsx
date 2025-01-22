import { useState, useEffect} from 'react'
import './App.css'
import {WalletState} from '@web3-onboard/core'
import metamaskSDK from '@web3-onboard/metamask'
import { init, useConnectWallet, useSetChain } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'

const MAINNET_RPC_URL = 'https://mainnet.infura.io/v3/c0c003cf22e54b4da6d8bc36339d340c'

// initialize the module with options
const metamaskSDKWallet = metamaskSDK({options: {
  extensionOnly: false,
  dappMetadata: {
    name: 'Demo Web3Onboard'
  }
}})

const injected = injectedModule()
const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: MAINNET_RPC_URL,
  },
  {
    id: '0x539',
    token: 'ETH',
    label: 'Localhost',
    rpcUrl: "http://localhost:8545",
  }
]

init({
  // This javascript object is unordered meaning props do not require a certain order
  wallets: [metamaskSDKWallet, injected],
  chains: chains
})

function App() {
  // App labels
  const [chainIdMap, setChainIdMap] = useState<Map<string, string>>(new Map<string, string>());

  // Wallet
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{connectedChain}] = useSetChain()

  // Ethers provider
  let ethersProvider

  const connect_wallet = async () => {
    let w: Promise<WalletState>
    if (!wallet) {
      await connect().then((v) => {
        w = Promise.resolve(v[0])
      })
    } else {
      w = Promise.resolve(wallet)
    }
    
    w!.then((v) => {
      ethersProvider = new ethers.BrowserProvider(v.provider, 'any')
    })
  };

  const disconnect_wallet = async () => {
    if (wallet) {
      await disconnect(wallet)
    }
  }

  // Set the chain mapping
  useEffect(() => {
    let chain_map = new Map<string, string>()
    chains.forEach((v) => {chain_map.set(v.id, v.label)})
    setChainIdMap(chain_map)
  }, [])

  return (
    <>
      <h1>Share Pay</h1>
      {!wallet ? (
        <button style={{ padding: 10, margin: 10 }} onClick={connect_wallet}>
          Connect Your Wallet!
        </button>
      ) : (
        <>
          <h3>Chain: {connectedChain?.id && 
          (chainIdMap.get(connectedChain?.id) ? chainIdMap.get(connectedChain?.id) : "Unsupported")}</h3>
          <h3>Wallet: {wallet.accounts[0].address}</h3>
          <button style={{ padding: 10, margin: 10 }} onClick={disconnect_wallet}>
            Disconnect
          </button>
        </>
      )}
    </>
  )
}

export default App
