import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL_SCHEDULE;

export const getSchedules = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};