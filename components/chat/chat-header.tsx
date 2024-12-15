import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ciclo_basico, Materia } from '@/lib/materias';

const ChatHeader = ({ subject }: { subject: Materia }) => {
  return (
    <div className=" w-full flex flex-col items-center gap-y-0">
      <div className="justify-center flex">
        <h1 className="text-2xl md:text-4xl text-center">StudMed</h1>
        <GraduationCap className="rotate-45" />
      </div>
      <h1
        className={`text-center w-[100px]  rounded-full text-white py-1 px-3 text-xs md:text-sm ${
          ciclo_basico.find((materia) => materia.nome === subject)?.bg
        }`}
      >
        {ciclo_basico.find((materia) => materia.nome === subject)?.title}
      </h1>
    </div>
  );
};

export default ChatHeader;
