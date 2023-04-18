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
