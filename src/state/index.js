import { create } from 'zustand';

export const useStoreGamesData = create((set) => ({
  gamesData: [],
  gamesOptionsForLabel: [],
  setGamesData: (data) => set((state) => (state.gamesData = data)),
  setGamesOptionsForLabel: (data) =>
    set((state) => {
      const newMappingData = data.map((d) => {
        return {
          label: d.title,
          value: d.id,
        };
      });
      return (state.gamesOptionsForLabel = newMappingData);
    }),
}));

export const useStoreCollectionAddress = create((set) => ({
  rawData: [],
  collectionData: [],
  collectionDataFiltered: [],
  setCollectionData: (data) => {
    const Collections = data.Collections?.map((el, i) => {
      return {
        key: i,
        no: i + 1,
        collectionId: el.address,
        game: el.gameId,
        dateUploaded: el.createdAt,
        dateUpdated: el.updatedAt,
        id: el.id,
      };
    });
    return set((state) => ({
      ...state,
      collectionData: Collections,
      rawData: data,
    }));
  },
  setCollectionDataFiltered: (value = '', type = '', data = []) => {
    let result = [];
    let whichDataTobeSorting = result.length > 0 ? result : data;

    if (type === 'search') {
      if (value === '') {
        result = [];
      } else {
        result = data.filter((collection) => {
          if (collection.collectionId.includes(value)) {
            return collection;
          }
        });
      }
    }

    if (type === 'sort') {
      result = [...whichDataTobeSorting].sort((a, b) => {
        if (value === 'ALPHABET') {
          return a.collectionId - b.collectionId;
        } else if (value === 'LAST UPDATED') {
          const dateA = Math.floor(new Date(a.dateUpdated).getTime() / 1000);
          const dateB = Math.floor(new Date(b.dateUpdated).getTime() / 1000);
          return dateB - dateA;
        } else if (value === 'LATEST UPLOADED') {
          const dateA = Math.floor(new Date(a.dateUploaded).getTime() / 1000);
          const dateB = Math.floor(new Date(b.dateUploaded).getTime() / 1000);
          return dateB - dateA;
        } else if (value === 'RESET') {
          result = [];
        }
      });
    }
    return set((state) => ({ ...state, collectionDataFiltered: result }));
  },
}));

/**
 * @param {Array} activeAdminData - data for active admin
 * @param {Array} inactiveAdminData - data for inactive admin
 * @param {Object} activeParams - contain the query data and metadata for the pagination purposes in active data admin
 * @param {Object} inactiveParams - contain the query data and metadata for the pagination purposes in inactive data admin
 */
export const useStoreAdminData = create((set) => ({
  activeAdminData: [],
  inactiveAdminData: [],
  activeParams: {
    query: { active: true, limit: 10, page: 1 },
    metadata: { total: 0, totalPage: 0 },
  },
  inactiveParams: {
    query: { active: false, limit: 10, page: 1 },
    metadata: { total: 0, totalPage: 0 },
  },
  setActiveAdminData: (data) => set((state) => (state.activeAdminData = data)),
  setInactiveAdminData: (data) =>
    set((state) => (state.inactiveAdminData = data)),
  setActiveParams: (data, key) =>
    set((state) => ({ activeParams: { ...state.activeParams, [key]: data } })),
  setInactiveParams: (data, key) =>
    set((state) => ({
      inactiveParams: { ...state.inactiveParams, [key]: data },
    })),
}));

export const useStoreNFTCollection = create((set) => ({
  nftCollections: [],
  activeCollections: [],
  setNftCollections: (data) =>
    set((state) => {
      return (state.nftCollections = data);
    }),
  setActive: (d) =>
    set((state) => {
      if (d !== 'ALL') {
        return (state.activeCollections = {
          data: state.nftCollections[parseInt(d)],
          index: d,
        });
      } else {
        let newArr = [];
        state.nftCollections.forEach((x) => {
          newArr.push(...x);
        });
        state.activeIndex = d;
        return (state.activeCollections = {
          data: newArr,
          index: 'ALL',
        });
      }
    }),

  setNftFilter: (value = '', type = '', data = []) => {
    let result = [];
    let whichDataTobeSorting = result.length > 0 ? result : data.data;

    if (type === 'search') {
      if (value === '') {
        result = [];
      } else {
        result = data.data.filter((collection) => {
          if (collection.title.toLowerCase().includes(value.toLowerCase())) {
            return collection;
          }
        });
      }
    }

    if (type === 'sort') {
      result = [...whichDataTobeSorting].sort((a, b) => {
        if (value === 'ALPHABET') {
          return a.title - b.title;
        } else if (value === 'LAST UPDATED') {
          const dateA = Math.floor(
            new Date(a.timeLastUpdated).getTime() / 1000
          );
          const dateB = Math.floor(
            new Date(b.timeLastUpdated).getTime() / 1000
          );
          return dateB - dateA;
        } else if (value === 'RESET') {
          result = [];
        }
      });
    }

    return set((state) => {
      let copiedNft = [];
      state.nftCollections.forEach((x) => {
        copiedNft.push(...x);
      });

      const returnedData = result.length > 0 ? result : copiedNft;
      return {
        ...state,
        activeCollections: { data: returnedData, index: data.index },
      };
    });
  },
}));

export const useStoreListedNFT = create((set) => ({
  listedNFT: [],
  listedFilteredNFT: [],
  detailNFT: [],
  setListedNFT: (data) => {
    const transformedData = data.map((item) => ({
      ...item,
      contract: {
        address: item.contractAddress,
      },
      rawMetadata: {
        image: JSON.parse(item.raw_data).image,
        name: item.title,
      },
      tokenId: item.tokenId,
      tokenType: JSON.parse(item.raw_data).tokenType,
    }));

    return set((state) => {
      return { listedNFT: transformedData, listedFilteredNFT: transformedData };
    });
  },
  setDetailNFT: (data) => {
    const {
      contractAddress,
      createdAt,
      updatedAt,
      price,
      rawData = JSON.parse(data?.raw_data),
    } = data ?? {};

    return set((state) => {
      return {
        ...state,
        detailNFT: {
          contractAddress,
          createdAt,
          updatedAt,
          price,
          rawData,
          ...data,
        },
      };
    });
  },
  setListedFilteredNFT: (value = '', type = '', data = []) => {
    let result = [];
    let whichDataTobeSorting = result.length > 0 ? result : data;

    if (type === 'search') {
      if (value === '') {
        result = [];
      } else {
        result = data.filter((nft) => {
          if (nft.title.toLowerCase().includes(value.toLowerCase())) {
            return nft;
          }
        });
      }
    }

    if (type === 'sort') {
      result = [...whichDataTobeSorting].sort((a, b) => {
        if (value === 'ALPHABET') {
          return a.title - b.title;
        } else if (value === 'LAST UPDATED') {
          const dateA = Math.floor(new Date(a.updatedAt).getTime() / 1000);
          const dateB = Math.floor(new Date(b.updatedAt).getTime() / 1000);
          return dateB - dateA;
        } else if (value === 'LAST UPLOADED') {
          const dateA = Math.floor(new Date(a.createdAt).getTime() / 1000);
          const dateB = Math.floor(new Date(b.createdAt).getTime() / 1000);
          return dateB - dateA;
        } else if (value === 'PRICE') {
          return a.price - b.price;
        } else if (value === 'RESET') {
          result = [];
        }
      });
    }

    return set((state) => {
      const returnedData = result.length > 0 ? result : state.listedNFT;
      return {
        ...state,
        listedFilteredNFT: returnedData,
      };
    });
  },
}));
