// import { Materia } from '@/lib/materias';
import { create } from 'zustand';

export const useSubjectStore = create((set) => ({
  subject: {
    id: 'geral',
    name: 'Geral',
  },
  setSubject: (subject: { name: string; bg: string; text: string }) =>
    set({ subject: subject }),
}))
