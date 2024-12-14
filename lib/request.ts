'use server';
import axios from 'axios';
import 'dotenv/config';

const api_url = process.env.BACKEND_URL;

export const submit_question = async (question: string, history: any) => {
  let answer: any = null;

  try {
    answer = await axios.post(`${api_url}/ask_question`, {
      question: question,
      history: history,
    });

    // answer = await axios.get('http://localhost:8000/')
    console.log(answer);
  } catch (error) {
    console.error('ERROR', error);
  }

  if (!answer) return answer;
  if (answer) return answer.data;
};
