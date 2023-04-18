// Setup: npm install alchemy-sdk
import { Alchemy, Network } from 'alchemy-sdk';

const config = {
  apiKey: 'QmomUXBGWXXVTPtvkq_EdiOwU9QhzusP',
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

export const getNftWithSpecificAddress = async (owner) => {
  // Get all NFTs
  const nfts = await alchemy.nft.getNftsForOwner(owner);
  console.log(nfts, 'nfts');
  // Print NFTs
  return nfts;
};

export const getContractMetadata = async (address) => {
  try {
    //Call the method to fetch metadata
    const response = await alchemy.nft.getContractMetadata(address);
    //Logging the response to the console
    return response;
  } catch (error) {
    throw error.message;
  }
};

export const getPriceNft = async () => {
  const pricing = await alchemy.nft
    .getMintedNfts('0xF97C7A13439DA91254B2D499685D52CC3E64E4EF')
    .then(console.log);
  // console.log(pricing, 'priceing');
};
