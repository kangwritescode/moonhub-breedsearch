import { create } from "zustand"

interface UIStore {
    showResults: boolean,
    isAnimating: boolean,
    setShowResults: (showResults: boolean) => void,
    setIsAnimating: (isAnimating: boolean) => void
}
export const useUIStore = create<UIStore>((set) => ({
    showResults: false,
    isAnimating: false,
    setIsAnimating: (isAnimating: boolean) => set({ isAnimating }),
    setShowResults: (showResults: boolean) => set({ showResults })
}))