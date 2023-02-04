import { Medusa } from "@medusa-network/medusa-sdk";
import * as ethers from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import {abi} from './abi'

// Contract deployed on hyperspace
const CONTRACT_QUOK_TEST = '0x8aCE3ACE905b006ACF901719222F22f6E4Dc70D7'

const medusaAddress = "0xd466a3c66ad402aa296ab7544bce90bbe298f6a0";
const provider = new JsonRpcProvider("https://api.hyperspace.node.glif.io/rpc/v1");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);


export const initMedusa = async () => {
    const medusa = await Medusa.init(medusaAddress, signer);
    return medusa
}

const createContractInstance = async () => {
    const contract = await new ethers.Contract(CONTRACT_QUOK_TEST,abi, signer);
    return contract
} 

export const encrypt = async (file: any) => {
    const medusa = await initMedusa()
    const contractInstance = await createContractInstance()
    const { encryptedData, encryptedKey } = await medusa.encrypt(file, medusaAddress);
    const price = ethers.utils.parseEther("0");
    const cipherID = await contractInstance.submitEntry(encryptedKey, price, {gasLimit: 1000000});
    console.log('cipherID',cipherID)    
    return { encryptedData, encryptedKey, cipherID }
}

export const decrypt = async (cipherId) => { 
    const medusa = await initMedusa()   
    const contractInstance = await createContractInstance()
    await medusa.signForKeypair();
    const pub = medusa?.keypair?.pubkey.toEvm()
    const options = {value: ethers.utils.parseEther("0")}
    // Error happens here
    const price = await contractInstance.itemToPrice(BigInt(cipherId.hash))
    const requestID = await contractInstance.buyEntry(cipherId, pub, {value:price});
    contractInstance.on("EntryDecryption", (from, to, value, event)=>{
        let transferEvent ={
            from: from,
            to: to,
            value: value,
            eventData: event,
        }
    })
}

const connectContract = async (medusa, encryptedCipherkey) => {
    const contractInstance = await createContractInstance()
    const price = ethers.utils.parseEther("0.5");
    const cipherID = await contractInstance.submitEntry(encryptedCipherkey, price);
}

