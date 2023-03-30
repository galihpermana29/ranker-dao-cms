import { create } from 'zustand';

export const useStoreGamesData = create((set) => ({
  gamesData: [],
  setGamesData: (data) => set((state) => (state.gamesData = data)),
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
