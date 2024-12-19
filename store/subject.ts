import { Materia } from '@/lib/materias';
import { create } from 'zustand';

export const useSubjectStore = create((set) => ({
  subject: {
    id: 'fisiologia',
    name: 'Fisiologia',
  },
  setSubject: (subject: { name: Materia; bg: string; text: string }) =>
    set({ subject: subject }),
}))
