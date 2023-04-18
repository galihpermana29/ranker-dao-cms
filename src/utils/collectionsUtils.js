import { getContractMetadata } from '@/api/alchemy';

export const mappingAddress = (addresses, setContractMetadataError) => {
  let arr = [];
  let status = true;
  for (let i = 0; i < addresses.length; i++) {
    if (!addresses[0] || !addresses[i].name || !addresses[i].name === '') {
      setContractMetadataError('Contract Address Is Required!');
      status = false;
      break;
    } else {
      arr.push(addresses[i].name);
    }
  }
  return status ? arr : false;
};

export const gettingTheContractMetaData = async (arrayOfContracts) => {
  let promises = [];
  arrayOfContracts.forEach(async (d) => {
    promises.push(getContractMetadata(d));
  });
  return Promise.all(promises);
};

export const checkContractAddressName = (stringName) => {
  if (stringName === undefined || stringName === '') {
    return Math.random().toString(36).slice(-5);
  } else {
    return stringName;
  }
};
