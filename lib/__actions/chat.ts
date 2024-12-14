'use server'

import { PrismaClient } from '@prisma/client';
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();
const prisma = new PrismaClient();

export const createChat = async ( userId: string, messages: any, subject: string) => {
  try {
    const newData = await prisma.history.create({
      data: {
        title: messages[0].content,
        userId: userId,
        messages: JSON.stringify(messages),
        history_subject: subject,
      },
    });

    return newData.id
  } catch (e) {
    console.error(e);
  }
};

export const updateChat = async (historyId: string, messages: any) => {
  try {
    await prisma.history.update({
        where: {
            id: historyId,
        },
        data: {
            messages: JSON.stringify(messages),
        },
        });
  } catch (e) {
    console.error(e);
  }
};

export const getMessages = async (historyId:string) =>{
  try {
    const messages = await prisma.history.findUnique({
      where: {
        id: historyId,
      }, select: {
        messages: true,
        id: true,
      }
    });

    return messages;
  } catch (e) {
    console.error(e);
  }
}

export const getHistory = async () => { 
 const {
  data: { user },
} = await (await supabase).auth.getUser();

const userId = user?.id

  try {
    const history = await prisma.history.findMany({
      where: {
        userId: userId,
      }, select: {
        id: true,
        title: true,
        history_subject: true,
      }
    });

    return history
  } catch (e) {
    console.error(e);
  }
}

export const deleteHistory = async (historyId: string) => {
  try {
    await prisma.history.delete({
      where: {
        id: historyId,
      },
    });
  } catch (e) {
    console.error(e);
  }
}