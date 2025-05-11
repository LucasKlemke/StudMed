// import { Materia } from '@/lib/materias';
import { create } from 'zustand'

export const useSubjectStore = create((set) => ({
  subject: {
    id: 'geral',
    name: 'Geral',
  },
  webSearch: false,
  guytonRag: false,
  setGuytonRag: (guytonRag: boolean) => set({ guytonRag: guytonRag }),
  setSubject: (subject: { name: string; bg: string; text: string }) =>
    set({ subject: subject }),
  setWebSearch: (webSearch: boolean) => set({ webSearch: webSearch }),
}))
