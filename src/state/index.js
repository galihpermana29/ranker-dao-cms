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
}));
