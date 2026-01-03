import { create } from 'zustand';
import type { EthnoItem, Mode } from '../data/ethnoData';

interface AppState {
  // Mode management
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
  
  // Selected item
  selectedItem: EthnoItem | null;
  setSelectedItem: (item: EthnoItem | null) => void;
  
  // Modal state
  isEditModalOpen: boolean;
  openEditModal: () => void;
  closeEditModal: () => void;
  
  // Panel state
  isPanelOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  
  // Loading state
  isGlobeLoaded: boolean;
  setGlobeLoaded: (loaded: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Mode management
  currentMode: 'instruments',
  setCurrentMode: (mode) => set({ currentMode: mode, selectedItem: null }),
  
  // Selected item
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item, isPanelOpen: item !== null }),
  
  // Modal state
  isEditModalOpen: false,
  openEditModal: () => set({ isEditModalOpen: true }),
  closeEditModal: () => set({ isEditModalOpen: false }),
  
  // Panel state
  isPanelOpen: false,
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  closePanel: () => set({ isPanelOpen: false, selectedItem: null }),
  
  // Loading state
  isGlobeLoaded: false,
  setGlobeLoaded: (loaded) => set({ isGlobeLoaded: loaded }),
}));
