// Setup: npm install alchemy-sdk
import { Alchemy, Network } from 'alchemy-sdk';

const config = {
  apiKey: 'QmomUXBGWXXVTPtvkq_EdiOwU9QhzusP',
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

export const getNftWithSpecificAddress = async (address) => {
  // Get all NFTs
  const nfts = await alchemy.nft.getNftsForOwner(address);
  // Print NFTs
  console.log(nfts, 'collection');
};
