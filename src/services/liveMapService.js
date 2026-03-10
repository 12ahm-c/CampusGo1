import axios from "axios";

const API_URL = "http://localhost:5000/api"; // عدّل حسب سيرفرك

export const getAllBuses = async () => {
  try {
    const res = await axios.get(`${API_URL}/buses`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getETA = async (busId) => {
  try {
    const res = await axios.get(`${API_URL}/bus/${busId}/eta`);
    return res.data.eta;
  } catch (err) {
    console.error(err);
    return null;
  }
};