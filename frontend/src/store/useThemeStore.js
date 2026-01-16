import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme:localStorage.getItem("chatzan-theme")||"forest",
  setTheme:(theme)=>{
    localStorage.setItem('chatzan-theme',theme)
    set({theme})
  }
}))
