import { ethers } from "ethers";

var abi = [
    ""
]

async function run() {
    // If you don't specify a //url//, Ethers connects to the default 
    // (i.e. ``http:/\/localhost:8545``)
    const provider = new ethers.JsonRpcProvider();

    // The provider also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, we need the account signer...
    const signer = await provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

    const bn = await provider.getBlockNumber();
    console.log(bn);

    // Transfer
    const tx_transfer = signer.sendTransaction({
        to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        value: ethers.parseEther("100.0"),
    });
}

run();
