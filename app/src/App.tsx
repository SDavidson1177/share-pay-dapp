import { useState, useEffect, useRef} from 'react'
import './App.css'
import metamaskSDK from '@web3-onboard/metamask'
import { init, useConnectWallet, useSetChain } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import SharePayABI from "../../share-pay/out/SharePay.sol/SharePay.abi.json" with { type: "json" };
import { BillPanel } from "./components/owner/Bill"
import { Deposit } from './components/shared/DepositWithdraw'
import { weiToEther } from './utils/operations'

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
  // Environment
  const [contractAddress, setContractAddress] = useState<string>(import.meta.env.VITE_CONTRACT_ADDRESS)

  // App labels
  const [chainIdMap, setChainIdMap] = useState<Map<string, string>>(new Map<string, string>())

  // Wallet
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{connectedChain}] = useSetChain()
  const [balance, setBalance] = useState<bigint>(0n)

  // Ethers
  const ethersProvider = useRef<ethers.BrowserProvider>()
  const signer = useRef<ethers.JsonRpcSigner>()
  const contract = useRef<ethers.Contract>()

  const connect_wallet = async () => {
    if (!wallet) {
      await connect()
    }
  };

  const disconnect_wallet = async () => {
    if (wallet) {
      await disconnect(wallet)
    }
  }

  // Initialize
  useEffect(() => {
    // Set the chain mapping
    let chain_map = new Map<string, string>()
    chains.forEach((v) => {chain_map.set(v.id, v.label)})
    setChainIdMap(chain_map)
  }, [])

  // When connected to a new chain, update provider and signer
  useEffect(() => {
    for (let i = 0; i < chains.length; i++) {
      console.log(chains[i].id + " | " + connectedChain?.id);
      if (chains[i].id == connectedChain?.id) {
        ethersProvider.current = new ethers.BrowserProvider(wallet?.provider!, 'any')
        ethersProvider.current.getSigner(wallet?.accounts[0].address).then((v) => {
          signer.current = v
          contract.current = new ethers.Contract(contractAddress, SharePayABI, signer.current)
        })
        break
      }
    }
  }, [connectedChain])

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
          <h3>Contract Address: {contractAddress}</h3>
          <h3>SharePay Balance: {balance ? weiToEther(balance) : 0} ETH</h3>
          <Deposit contract={contract.current} signer={signer.current} setBalance={(v: bigint) => {
            setBalance(v);
          }}></Deposit>

          {/* Bill Interaction */}
          <BillPanel contract={contract.current} signer={signer.current}/>

          <button style={{ padding: 10, margin: 10 }} onClick={disconnect_wallet}>
            Disconnect
          </button>
        </>
      )}
    </>
  )
}

export default App
