import { Materia } from '@/lib/materias';
import { create } from 'zustand';

export const useSubjectStore = create((set) => ({
  subject: {
    nome: 'Bioquímica',
    bg: 'bg-subject1',
    text: 'text-subject1',
  },
  setSubject: (subject: {
    nome: Materia;
    bg: string;
    text: string;
  }) => set({ subject: subject }),
}));
