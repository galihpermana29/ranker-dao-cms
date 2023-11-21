export function imageBaseUrl(value) {
  return import.meta.env.MODE === 'development'
    ? '/dev' + value
    : import.meta.env.VITE_BASE_URL + value;
}

export const getUniqueAddress = (array) => {
  const initialValue = {};
  array.forEach((e) => (initialValue[e.address] = true));

  return initialValue;
};

export function params(data) {
  return Object.keys(data)
    .map((key) => `addresses=${encodeURIComponent(key)}`)
    .join('&');
}

export function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

export function transformErcData(data) {
  const dataTransformed = data.reduce((result, item) => {
    const { address, tokenId, price } = item;
    const existingEntry = result.find((entry) => entry.address === address);

    if (existingEntry) {
      existingEntry.data.push({ tokenId: Number(tokenId), price });
    } else {
      result.push({ address, data: [{ tokenId: Number(tokenId), price }] });
    }

    return result;
  }, []);

  return dataTransformed;
}

export function prepareBatchListing(inputData, lister) {
  const erc721Data = inputData.filter((data) => data.tokenType === 'ERC721');
  const erc1155Data = inputData.filter((data) => data.tokenType === 'ERC1155');

  const transform721 = transformErcData(erc721Data);
  const transform1155 = transformErcData(erc1155Data);

  const mappedData = inputData.map((item) => ({
    contractAddress: item.address,
    tokenId: item.tokenId,
    title: item.name,
    gameId: item.gameId,
    price: item.price,
    raw_data: JSON.stringify({ ...item, lister }), // Include all data that is not specified
    uploadedBy: JSON.parse(localStorage.getItem('email')),
  }));

  return {
    payloadWeb3: { erc721: transform721, erc1155: transform1155 },
    payloadWeb2: mappedData,
  };
}
