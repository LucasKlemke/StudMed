// import { Materia } from '@/lib/materias';
import { create } from 'zustand';

export const useSubjectStore = create((set) => ({
  subject: {
    id: 'fisiologia',
    name: 'Fisiologia',
  },
  setSubject: (subject: { name: string; bg: string; text: string }) =>
    set({ subject: subject }),
}))
