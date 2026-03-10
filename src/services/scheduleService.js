import axios from 'axios';

export const getSchedules = async () => {
  const response = await axios.get('http://localhost:3000/api/schedule');
  return response.data;
};
