import Web3 from 'web3';
import axios from 'axios';
// Initialize the Web3 provider
const provider = new Web3.providers.HttpProvider(
  'https://bsc-dataseed1.binance.org:443'
);
const web3 = new Web3(provider);

// Replace <your_wallet_address> with the actual wallet address you want to query
const walletAddress = '0xF97C7A13439DA91254B2D499685D52CC3E64E4EF';
const apiKey = 'PU6CX4EWKRIAM3M5R888WMHX4C42RCW7FN';

// Retrieve the list of NFTs owned by the wallet address from the BscScan API
export async function getNFTCollection() {
  const response = await axios.get(
    `https://api.bscscan.com/api?module=account&action=tokennfttx&address=${walletAddress}&startblock=1&endblock=999999999&sort=asc&apikey=${apiKey}`
  );
  const txs = response.data.result;
  console.log(txs, 'response api');
  const nfts = {};

  // Loop through all the NFT transactions and extract the collection name and token ID
  for (const tx of txs) {
    const contractAddress = tx.contractAddress.toLowerCase();
    const tokenID = tx.tokenID;
    const collection = await getNFTCollectionName(contractAddress);
    console.log(collection, 'collection');
    // Add the NFT to the collection object
    if (collection in nfts) {
      nfts[collection].push(tokenID);
    } else {
      nfts[collection] = [tokenID];
    }
  }

  return nfts;
}

// Retrieve the name of the NFT collection from the contract address using the BscScan API
async function getNFTCollectionName(contractAddress) {
  const response = await axios.get(
    `https://api.bscscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
  );
  const abi = JSON.parse(response.data.result);

  // Look for the name field in the contract ABI
  for (const item of abi) {
    if (
      item.type === 'function' &&
      item.name === 'name' &&
      item.outputs.length === 1 &&
      item.outputs[0].type === 'string'
    ) {
      return web3.eth.call({
        to: contractAddress,
        data: web3.eth.abi.encodeFunctionCall(item, []),
      });
    }
  }

  return 'Unknown Collection';
}

// // Call the getNFTCollection function and log the result
